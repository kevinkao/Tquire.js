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
	
	var require = global.require,
		define = global.define,
		tquire,
		count  = 0,
		defConfig = {};

	function Tquire(cfg) {
		this.config         = extend(defConfig, cfg);
		this._require       = require.config(this.config);
		this._hooks          = {};
		this.asyncRemaining = 0;
		this.required       = false;
	}

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
			self._require([id], function(module) {
				self._hooks[id] = callback.call(this, module);
				if ( ! --self.asyncRemaining && self.required === true ) {
					self.require(self.requiredID, self.requiredCallback);
				}
			});
			return self;
		},

		/**
		 * Get hook returns
		 * @return {object} module
		 */
		hooks: function(id) {
			return this._hooks[id];
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

				this._require([id], function(module) {
					callback.call(this, module, self);
				});
			}
		}
	};

	global.tquire = tquire = function(cfg) {
		return new Tquire(cfg);
	};

})(window);