(function () {
    "use strict";

    var dict = Session.dict();

    Session.addKeyBuilder = function(key, builderName, builderFn) {
        var obj = dict[key];
        obj || (obj = dict[key] = {listeners: []});
        _.defaults(dict[key], {builders: {}});

        obj.builders[builderName] = builderFn;
    };

    Session.buildKeys = function(builderName) {
        return _.reduce(dict, function(out, obj, key) {
            if(obj.builders) {
                var builder = obj.builders[builderName];
                builder && builder(out, key, dict[key].value);
            }
            return out;
        }, {});
    }

}());