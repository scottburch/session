describe('a big use', function () {

    var spy1 = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    var spy3 = jasmine.createSpy();
    var key1 = _.uniqueId();
    var key2 = _.uniqueId();


    beforeEach(function () {
        Autorun(function () {
            spy1();
            Session.get(key1);
            Session.set(key2, 10);
        });

        Autorun(function() {
            spy2();
            Session.get(key1);
        });

        Autorun(function() {
            spy3();
            Session.get(key2);
        });
    });

    it('should only fire autorun blocks that have changes', function () {
        Session.set(key1, '1');
        expect(spy1.calls.count()).toBe(2);
        expect(spy2.calls.count()).toBe(2);
        expect(spy3.calls.count()).toBe(2);
    });


});