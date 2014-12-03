describe('ifNotDefined()', function() {
    "use strict";

    var spy, key;

    beforeEach(function() {
        spy = jasmine.createSpy();
        key = _.uniqueId();
    });

    it('should not execute function if the key is defined', function() {
        Session.set(key, 'xxx');
        Session.ifNotDefined(key, spy);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should execute function if key is defined', function() {
        Session.ifNotDefined(key, spy);
        expect(spy).toHaveBeenCalled();
    });

    it('should execute function if key is set to undefined', function() {
        Session.set(key, undefined);
        Session.ifNotDefined(key, spy);
        expect(spy).toHaveBeenCalled();
    });

});