describe('getProp()', function() {
    "use strict";

    it('should store a property to a non-existent key', function() {
        var key = _.uniqueId();
        Session.setProp(key, 'foo', 'bar');
        expect(Session.get(key).foo).toBe('bar');
    });

    it('should store a deep property to a non-existent key', function() {
        var key = _.uniqueId();
        Session.setProp(key, 'foo.bar.baz', 'xxx');
        expect(Session.get(key).foo.bar.baz).toBe('xxx');
    });

    it('should store a deep property to existent key', function() {
        var key = _.uniqueId();
        Session.set(key, {foo:{bar:{baz:'yyy'}}});
        Session.setProp(key, 'foo.bar.baz', 'xxx');
        expect(Session.get(key).foo.bar.baz).toBe('xxx');
    });

    it('should store a deep property and create objects as it goes to existent key', function() {
        var key = _.uniqueId();
        Session.set('key', {foo:{}});
        Session.setProp(key, 'foo.bar.baz', 'xxx');
        expect(Session.get(key).foo.bar.baz).toBe('xxx');
    });


    it('will fire an Autorun on any change to the key (but should not unless you set that property)', function() {
        var key = _.uniqueId();
        var spy = jasmine.createSpy();
        Autorun(function() {
            Session.getProp(key, 'baz');
            spy();
        });
        expect(spy.calls.count()).toBe(1);
        Session.setProp(key, 'foo.bar', 'xxx');
        expect(spy.calls.count()).toBe(2);
    });
});