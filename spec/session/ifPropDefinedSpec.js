describe('ifPropDefined()', function() {
    "use strict";
    it('should run a function with value if the property is defined', function () {
        var key = _.uniqueId();
        var spy = jasmine.createSpy();
        Session.ifPropDefined(key, 'foo.bar', spy);
        expect(spy.calls.count()).toBe(0);
        Session.setProp(key, 'foo.bar', 'xxx');
        Session.ifPropDefined(key, 'foo.bar', spy);
        expect(spy.calls.count()).toBe(1);
        expect(spy).toHaveBeenCalledWith('xxx');
    });

    it('should trigger an autorun', function() {
        var key = _.uniqueId();
        var autorunSpy = jasmine.createSpy();
        var spy = jasmine.createSpy();
        Autorun(function() {
            autorunSpy();
            Session.ifPropDefined(key, 'foo.bar', spy);
        });
        expect(autorunSpy.calls.count()).toBe(1);
        expect(spy.calls.count()).toBe(0);
        Session.setProp(key, 'foo.bar', 'xxx');
        expect(autorunSpy.calls.count()).toBe(2);
        expect(spy.calls.count()).toBe(1);
        expect(spy).toHaveBeenCalledWith('xxx');
    });
});