define(["moduleb"], function(b) {
	return {
		proxy: function(arg) {
			// do somethong
			return b.foo(arg);
		}
	};
});