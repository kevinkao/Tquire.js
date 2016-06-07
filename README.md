# tquirejs

## Simple Tool for AMD javascript unit testing

Work on [RequireJS](http://requirejs.org/), [QUnit](https://qunitjs.com/) and [SinonJS](http://sinonjs.org/)

## Installation

``` bash
bower install tquirejs
```

## Example

``` js
tquire()
.hook('moduleb', function(b) {
	// You can stub or spy here
	sinon.stub(b, "foo")
		.withArgs("arg1").returns(true)
		.withArgs("arg2").returns(false);
	return b;
})
// 
// .hook('modulec', function() {})
// .hook('moduled', function() {})
// ... can hook more module
.require('modulea', function(b /*, c , d */, a) {

	QUnit.module('modulea');

	QUnit.test('first testing', function(assert) {
		assert.expect(4);

		assert.equal(a.proxy("arg1"), true);
		assert.equal(a.proxy("arg2"), false);
		assert.equal(a.proxy("arg3"), undefined);
		assert.equal(b.foo.calledThrice, true);
	});

});
```
