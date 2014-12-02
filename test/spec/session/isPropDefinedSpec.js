describe('isPropDefined()', function() {
    "use strict";
    var key;

    beforeEach(function() {
        key = _.uniqueId();
        Session.set(key, {
            foo:{
                bar:{
                    undef:undefined,
                    true: true,
                    false: false,
                    str: 'string',
                    zero: 0
                }
            }
        });
    });

    it('should return true if a property exists and contains a value other than undefined', function() {
        expect(Session.isPropDefined(key, 'foo.bar')).toBe(true);
        expect(Session.isPropDefined(key, 'foo.bar.undef')).toBe(false);
        expect(Session.isPropDefined(key, 'foo.bar.true')).toBe(true);
        expect(Session.isPropDefined(key, 'foo.bar.false')).toBe(true);
        expect(Session.isPropDefined(key, 'foo.bar.zero')).toBe(true);
    });
});