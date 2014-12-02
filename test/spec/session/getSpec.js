describe('get()', function () {
    "use strict";
    var autorunSpy;

    describe('Basic get and autorun functions', function () {
        it('should get "testValue" from "testKey"', function () {
            var ret = setUniqueKey('testValue');
            expect(Session.get(ret.key)).toBe('testValue');
        });

        it('should trigger the Autorun function when key is updated that is retrieved in autorun function', function () {
            var ret = setUniqueKey();
            expect(ret.spy.calls.count()).toBe(1);
        });
    });

    function setUniqueKey(value) {
        value = value || 'testValue';
        var key = 'key.' + _.uniqueId();
        var spy = jasmine.createSpy('autorun function', function () {
            return Session.get(key);
        });
        Autorun(spy);
        Session.set(key, value);
        return {key: key, spy: spy};
    }


});