describe('autorun', function() {
    "use strict";

    it('should not stop other contexts if a key is invalidated in one context', function() {
        var c1spy = jasmine.createSpy();
        var c2spy = jasmine.createSpy();
        var key = _.uniqueId();
        var stop;

        Autorun(function() {
            c1spy();
            stop || Session.get(key);
        });

        Autorun(function() {
            c2spy();
            Session.get(key);
        });

        expect(c1spy.calls.count()).toBe(1);
        expect(c2spy.calls.count()).toBe(1);

        stop = true;
        Session.set(key, 1);
        expect(c1spy.calls.count()).toBe(2);
        expect(c2spy.calls.count()).toBe(2);

        Session.set(key, 2);
        expect(c1spy.calls.count()).toBe(2);
        expect(c2spy.calls.count()).toBe(3);
    });


    it('should stop running for a key if session getters with the same key are not run again at some point, but start again if it is', function() {
        var spy = jasmine.createSpy();
        var key = _.uniqueId();
        var key2 = _.uniqueId();
        var stop;
        var value;

        Autorun(function() {
            spy();
            Session.get(key2);
            if(!stop) {
                value = Session.get(key);
            }
        });

        stop = false;

        expect(spy.calls.count()).toBe(1);
        expect(value).toBe(undefined);

        Session.set(key, 'xxx');
        expect(spy.calls.count()).toBe(2);
        expect(value).toBe('xxx');

        stop = true;

        Session.set(key, 'xxx');
        expect(spy.calls.count()).toBe(3);
        expect(value).toBe('xxx');

        Session.set(key, 'www');
        expect(spy.calls.count()).toBe(3);
        expect(value).toBe('xxx');

        stop = false;

        Session.set(key2);
        expect(spy.calls.count()).toBe(4);
        expect(value).toBe('www');

        Session.set(key, 'zzz');
        expect(spy.calls.count()).toBe(5)
        expect(value).toBe('zzz');
    });

    describe('nested autoruns', function () {
        var innerSpy, outerSpy, outerKey, innerKey, afterKey;
        
        beforeEach(function() {
            innerKey = _.uniqueId();
            outerKey = _.uniqueId();
            afterKey = _.uniqueId();

            innerSpy = jasmine.createSpy('inner autorun').and.callFake(_.partial(Session.get, innerKey));
            outerSpy = jasmine.createSpy('outer autorun').and.callFake(function () {
                Session.get(outerKey);
                Autorun(innerSpy);
                Session.get(afterKey);
            });
            Autorun(outerSpy);
            
        });

        it('should trigger inner autorun not outer when autorun closures are nested', function () {
            Session.set(innerKey, 'x');
            expect(outerSpy.calls.count()).toBe(1);
            expect(innerSpy.calls.count()).toBe(2);
        });

        it('should trigger inner spy again when outerKey is set', function () {
            Session.set(outerKey, 'x');
            expect(outerSpy.calls.count()).toBe(2);
            expect(innerSpy.calls.count()).toBe(2);
        });

        it('should not add second listener when spys are nested and outer spy is triggered', function () {
            Session.set(outerKey, 'x');
            Session.set(innerKey, 'x');
            expect(outerSpy.calls.count()).toBe(2);
            expect(innerSpy.calls.count()).toBe(3);
        });

        it('should trigger outer autorun if key after inner Autorun is updated', function() {
            Session.set(afterKey);
            expect(outerSpy.calls.count()).toBe(2);
            expect(innerSpy.calls.count()).toBe(2);
        });
    });
});