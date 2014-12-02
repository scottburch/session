describe('isNotDefined()', function() {
    "use strict";

    it('should return false if a key is defined and contains a value', function() {
        var key = _.uniqueId();
        Session.set(key, 'xxx');
        expect(Session.isNotDefined(key)).toBe(false);
    });

    it('should return false if a key is defined, but has a value of undefined', function() {
        var key = _.uniqueId();
        Session.set(key, undefined);
        expect(Session.isNotDefined(key)).toBe(true);
    });

    it('should return true if a key is not defined', function() {
        expect(Session.isNotDefined('fake.key')).toBe(true);

    });
});