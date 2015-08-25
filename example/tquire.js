(function(global, undefined) {
	"use strict";

	function isObject(obj) {
		return Object.prototype.toString.call(obj) === '[object Object]';
	}
	
	function extend(/* ob1, objN, ... */) {
		var objs = Array.prototype.slice.call(arguments);
		var target = objs[0];
		for (var i = 1, len = objs.length; i < len; i++) {
			var obj = objs[i];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					target[key] = obj[key];
				}
			}
		}
		return target;
	}
	
	var origRequire = global.require,
		define = global.define,
		require = origRequire,
		tquire,
		count  = 0,
		requiredCallbacks = [],
		doneCallbacks = [],
		requireSuite = 0,
		defConfig = {};

	if (typeof global.tquire !== 'undefined' && isObject(global.tquire)) {
		extend(defConfig, global.tquire);
	}

	function Tquire(cfg) {
		this.config         = extend({}, defConfig, cfg, { "context" : "context" + count++ });
		this._require       = origRequire.config(this.config);
		this._hooks         = [];
		this._hookSeq       = 0;
		this.asyncRemaining = 0;
		this.required       = false;
		global.require      = this._require;
	}

	Tquire.requireDone = function(callback) {
		requiredCallbacks.push(callback);
	};

	Tquire.done = function(callback) {
		doneCallbacks.push(callback);
	};

	Tquire.prototype = {
		/**
		 * Hook module before require
		 * @param  {string}   id       module name
		 * @param  {Function} callback
		 * @return {object}            Tquire
		 */
		hook: function(id, callback) {
			var self = this;
			self.asyncRemaining++;
			var seq = self._hookSeq++;
			self._require([id], function(module) {
				self._hooks[seq] = callback.call(this, module);
				if ( ! --self.asyncRemaining && self.required === true ) {
					self.require(self.requiredID, self.requiredCallback);
				}
			});
			return self;
		},

		/**
		 * Require the plan target
		 * @param  {string}   id       
		 * @param  {Function} callback
		 * @return {void}            
		 */
		require: function(id, callback) {
			var self = this;
			if (this.asyncRemaining > 0) {
				this.required = true
				this.requiredID = id;
				this.requiredCallback = callback;
			} else {
				this.required = false;
				this.requiredID = null;
				this.requiredCallback = null;
				requireSuite++;

				this._require([id], function(module) {
					callback.apply(this, self._hooks.concat(module));
					// Fired required done event
					for (var i = 0, len = requiredCallbacks.length; i < len; i++) {
						requiredCallbacks[i].call(this, {
							id: id,
							module: module
						});
					}
					if ( ! --requireSuite ) {
						// Fire all done event
						for (var i = 0, len = doneCallbacks.length; i < len; i++) {
							doneCallbacks[i].call(this);
						}
					}
				});
			}
		}
	};

	global.Tquire = Tquire;
	global.tquire = tquire = function(cfg) {
		return new Tquire(cfg);
	};

})(window);