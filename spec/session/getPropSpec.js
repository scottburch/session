describe('getProp()', function() {
    "use strict";

    it('should get a shallow value', function() {
        var key = _.uniqueId();
        Session.set(key, {foo:'xxx'});
        expect(Session.getProp(key, 'foo')).toBe('xxx');
    });

    it('should get a deep value', function() {
        var key = _.uniqueId();
        Session.set(key, {foo:{bar:{baz:'xxx'}}});
        expect(Session.getProp(key, 'foo.bar.baz')).toBe('xxx')
    });

    it('should return undefined for non-existent key without an exception and without creating a key', function() {
        expect(Session.getProp('non.existent.key', 'some.prop')).not.toBeDefined();
        expect(Session.isNotDefined('non.existent.key')).toBe(true);
    });

    it('should return undefined for non-existent properties without throwing exception', function() {
        var key = _.uniqueId();
        Session.set(key, {foo:'xxx'});
        expect(Session.getProp(key, 'foo.bar.baz.futz')).not.toBeDefined();
    });

});