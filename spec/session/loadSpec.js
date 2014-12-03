describe('load()', function() {
    "use strict";
    var loadObj = {
        foo: 'bar',
        boo: 'baz'
    };

    beforeEach(function() {
        Session.clear();
    });

    it('should take an object and load the session store', function() {
        Session.load(loadObj);
        expect(Session.get('foo')).toBe('bar');
        expect(Session.get('boo')).toBe('baz');
    });

    it('should fire Autorun blocks', function() {
        var spy = jasmine.createSpy().and.callFake(_.partial(Session.get, 'foo'));
        Autorun(spy);

        expect(spy.calls.count()).toBe(1);
        Session.load(loadObj);
        expect(spy.calls.count()).toBe(2);
    });
});