this.___ = undefined;

(function () {
    "use strict";
    _.mixin({
        parseJson: function(string) {
            try {
                return JSON.parse(string);
            } catch(e) {
                throw e;
            }
        },
        stringifyJson: function(obj) {
            try {
                return JSON.stringify(obj);
            } catch(e) {
                throw e;
            }
        },
        autocurry: function autocurry(fn) {
            return function () {
                var args = [];
                var expected = fn.length;
                if (checkArgs(arguments)) {
                    return fn.apply(null, args);
                } else {
                    return function curried() {
                        if (checkArgs(arguments)) {
                            return fn.apply(null, args);
                        } else {
                            return curried;
                        }
                    }
                }

                function checkArgs(a) {
                    args = args.concat(Array.prototype.slice.call(a))
                    return args.length >= expected;
                }
            }
        },
        maybe: function (val) {
            return {
                map: function (fn) {
                    val && fn(val);
                }
            }
        },
        trueDeepClone: function deepClone(obj) {
            if (obj == null || typeof(obj) != 'object')
                return obj;

            var temp = obj.constructor(); // changed

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    temp[key] = deepClone(obj[key]);
                }
            }
            return temp;
        },
        fn: _.partial,
        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        },
        'if': function (testFn, fn) {
            if(typeof testFn !== 'function') {
                return _.if(_.constant(testFn), fn);
            }
            var result = testFn();
            result && fn();
            return {
                then: function(fn) {
                    result && fn();
                },
                else: function (fn) {
                    result || fn();
                }
            }
        },
        'equal': function(a,b) {
            return _.valueOf(a) === _.valueOf(b);
        },
        'valueOf': function(v) {
            return typeof v === 'function' ? v() : v;
        },
        forceArray: function (arr) {
            if (arr === undefined) {
                return [];
            }
            if (_.isArray(arr)) {
                return arr;
            }
            if (arr.length) {
                return Array.prototype.slice.call(arr);
            }

        },
        argsToArray: function (args) {
            return Array.prototype.slice.call(args)
        },
        partial: function (fn) {
            var argsIn = _.rest(this.argsToArray(arguments));

            return function () {
                var args = _.argsToArray(arguments);
                argsIn.forEach(function (arg, idx) {
                    arg === ___ && (argsIn[idx] = args.shift())
                });
                return fn.apply(this, argsIn.concat(args));
            }
        },

        arity: function (fn, arity) {
            return function () {
                fn.apply(this, _.first(Array.prototype.slice.call(arguments), arity));
            }
        },
        callMethod: function (methName) {
            var args = _.argsToArray(arguments).slice(1);
            var methArr = methName.split('.');
            return function (obj) {
                var args2 = _.argsToArray(arguments).slice(1);
                var m;
                return (function loop(obj, arr) {
                    if (arr.length) {
                        m = obj[arr.shift()];
                        return arr.length ? loop(m, arr) : m.apply(obj, args.concat(args2));
                    }
                }(obj, methArr.slice(0)));
                return _.prop(methName)(obj).apply(obj, args);
            }
        },
        setProp: function (obj, propName, value) {
            propName = propName.toString();
            var propArr = propName.split('.');

            return (function loop(obj, arr) {
                var pName = arr.shift();
                if (arr.length > 0) {
                    if (obj[pName] === undefined) {
                        obj[pName] = {};
                    }
                    loop(obj[pName], arr)
                } else {
                    obj[pName] = value;
                }
            }(obj, propArr.slice(0)));

        },
        prop: function (obj, propName) {
            if (arguments.length === 1) {
                propName = obj;
                return returnFunction();
            } else {
                return returnProp();
            }

            function returnFunction() {
                propName = propName.toString();
                var propArr = propName.split('.');
                return function (obj) {
                    var v;
                    return (function loop(obj, arr) {
                        if (arr.length) {
                            v = obj[arr.shift()];
                            v !== undefined && loop(v, arr);
                        }
                        return v;
                    }(obj, propArr.slice(0)));
                }
            }

            function returnProp() {
                return _.prop(propName)(obj)
            }
        }
    });
    _.mixin({
        dot: _.prop
    })
}());
