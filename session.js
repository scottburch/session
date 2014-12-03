(function (global) {
    "use strict";
    var currentContext;
    var dict = {};

    var contextList = [];

    function Context(fn) {
        var deps = [];

        var that = {
            fn: fn,
            flush: function() {
                if(_.some(deps, _.property('invalid'))) {
                    that.run({});
                }
            },
            addDependency: function(dep) {
                deps.indexOf(dep) === -1 && deps.push(dep);
            },
            run: function(opts) {
//                if(currentContext !== that) {
                    deps = [];
                    var prevContext = currentContext;
                    currentContext = that;
                    fn(opts);
                    currentContext = prevContext;
//                }
            }
        };
        return that;
    }

    Context.flush = function() {
        _.each(contextList, _.callMethod('flush'));
    };

    function Dependency() {
        var that = {
            changed: function() {
                that.invalid = true;
                Context.flush();
            },
            depend: function() {
                currentContext && currentContext.addDependency(that);
            }
        };
        return that;
    }


    function getFromDict(key, def) {
        var obj = dict[key] || (dict[key] = {value:def});
        obj.deps = obj.deps || [];
        return obj;
    }

    global.Session = {
        set: function (key, val) {
            var obj = getFromDict(key);
            obj.value = val;
            var deps = obj.deps.slice(0);
            obj.deps=[];
            _.each(deps, function(dep) {dep.changed()});
        },
        get: function (key) {
            var obj = getFromDict(key);
            var dep = Dependency();
            dep.depend();
            obj.deps.push(dep);
            return obj.value;
        },
        getProp: _.autocurry(function (key, propName) {
            var obj = Session.get(key);
            return obj ? _.prop(obj, propName) : undefined;
        }),
        setProp: _.autocurry(function (key, propName, value) {
            var obj = getFromDict(key);
            obj.value || (obj.value = {});
            _.setProp(obj, propName, value);
            Session.set(key, obj);
        }),
        isPropDefined: function(key, propName) {
            return Session.getProp(key, propName) !== undefined;
        },
        ifPropDefined: function (key, propName, fn) {
            var val = Session.getProp(key, propName);
            !!((val !== undefined) && fn(val));
        },
        ifPropNotDefined: function (key, propName, fn) {
            Session.getProp(key, propName) === undefined && fn();
        },
        isDefined: function(key) {
            return Session.get(key) !== undefined;
        },
        isNotDefined: function(key) {
            return !Session.isDefined(key);
        },
        ifNotDefined: function (key, fn) {
            Session.isDefined(key) || fn()
        },
        isEqual: function(key, value) {
            return Session.get(key) === value;
        },
        ifEquals: function (key, value, fn) {
            var v= Session.get(key);
            value === v && fn(v);
            return {
                else: function(elseFn) {
                    value !== v && elseFn(v);
                }
            }
        },
        isPropEquals: function(key, propName, value) {
            return Session.getProp(key, propName) === value;

        },
        ifPropEquals: function(key, propName, value, fn ){
            var v = Session.getProp(key, propName);
            value === v && fn(v);
            return {
                else: function(elseFn) {
                    value !== v && elseFn(v);
                }
            }
        },
        dict: function() {
            return dict;
        },
        dump: function() {
            return _.reduce(_.keys(dict), function(ret, key) {
                ret[key] = dict[key].value;
                return ret;
            }, {})
        },
        load: function(obj) {
            _.each(obj, function(value, key) {
                Session.set(key, value);
            });
        },
        clear: function(key) {
            if(key) {
                delete dict[key];
            } else {
                _.each(_.keys(dict), function(key){
                    delete dict[key];
                });
            }
        }
    }

    global.Autorun = function (fn) {
        var ctx = _.find(contextList, {fn: fn});
        if(ctx) {
            ctx.run({});
        } else {
            ctx = Context(fn);
            ctx.run({firstRun:true});
            contextList.push(ctx);
        }
    }
}(this));