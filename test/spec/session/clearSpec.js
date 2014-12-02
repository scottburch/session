describe('clear()', function() {
    "use strict";

    beforeEach(function() {
        Session.load({
            foo: 'bar',
            boo: 'baz'
        });
    });

    it('should clear a specified key if a key is passed', function() {
        Session.clear('foo');
        expect(Session.get('foo')).not.toBeDefined();
        expect(Session.get('boo')).toBe('baz');
    });

    it('should clear all keys if no key is passed', function() {
        Session.clear();
        expect(Session.get('foo')).not.toBeDefined();
        expect(Session.get('boo')).not.toBeDefined();
    });
});