describe('builder', function() {
    "use strict";

    beforeEach(function() {
        Session.set('a', 'aaa');
        Session.set('b', 'bbb');
        Session.set('c', 'ccc');
    });

    it('should build a single object from keys with builders', function() {
        function builderFn (obj, key, value) {
            obj[key] = '-' + key + '-' + value +  '-';
        };
        _.each(['a','b','c'], function(key) {
            Session.addKeyBuilder(key, 'builder1', builderFn);
        });

        var ret = Session.buildKeys('builder1');

        expect(_.isEqual(ret, {
            a: '-a-aaa-',
            b: '-b-bbb-',
            c: '-c-ccc-'
        })).toBe(true);
    });
});