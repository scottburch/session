describe('isDefined()', function() {
    "use strict";

    var key;

    beforeEach(function() {
        key = _.uniqueId();
    });

    it('should return true if a key is defined and is not undefined', function() {
        Session.set(key, 'xxx');
        expect(Session.isDefined(key)).toBe(true);

        Session.set(key, false);
        expect(Session.isDefined(key)).toBe(true);
    });

    it('should return false if a key is defined, but contains undefined', function() {
        Session.set(key, undefined);
        expect(Session.isDefined(key)).toBe(false);
    });

    it('should return false if a key is not defined', function() {
        expect(Session.isDefined('fake.key')).toBe(false);

    });
});