describe('dump()', function() {
    "use strict";

    beforeEach(function() {
        Session.clear();
    });

    it('should return an object of keys and values in Session', function() {
        Session.set('foo', 'bar');
        Session.set('baz', 'boo');

        var obj = Session.dump();

        expect(_.keys(obj).length).toBe(2);
        expect(obj.foo).toBe('bar');
        expect(obj.baz).toBe('boo');
    });
});