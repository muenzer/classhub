describe('The update module has a', function() {

  beforeEach(angular.mock.module('update'));

  describe('update services', function() {
    var update;

    beforeEach(inject(function(_update_) {
      update = _update_;
    }));

    it('that should exist', function() {
      expect(update).toBeDefined();
    });

    it('that should have a status function', function() {
      expect(update.status).toBeDefined();
    });

    describe('that creates a data output', function() {
      var item = {};

      beforeEach(function() {
        item = {
          "Deposit": "true",
          "CourseSession": "748#992",
          "Number": "2",
          "ClassName": "Intro to Clay - Four Week Class",
          "Cost": "200",
          "Date":"2016-08-30T10:56:03+02:00",
          "EmailAddress": "chris.muenzer@gmail.com",
          "Name": "Chris Muenzer",
          "Type": "Class"
        };
      });

      it("should return a data string for a new class", function() {

        var data = update.status(item, 'Registered');

        expect(data.Template).toEqual(2);
        expect(data.Payment).toEqual(100);
        expect(data.DueDate).toBeDefined();
        expect(data.EmailFlag).toBe(true);
        expect(data.Message).toBeDefined();
      });
      it("should return a data string for a new workshop", function() {
        item.Type = "Workshop";

        var data = update.status(item, 'Registered');

        expect(data.Template).toEqual(4);
        expect(data.Payment).toEqual(400);
        expect(data.DueDate).toBeDefined();
        expect(data.EmailFlag).toBe(true);
      });
      it("should return a data string for a waitlist", function() {

        var data = update.status(item, 'Wait List');

        expect(data.Template).toEqual(3);
        expect(data.EmailFlag).toBe(true);
      });
      it("should return a welcome message", function() {

        item.PaymentStatus = "Wait List";
        var data = update.status(item, 'Registered');

        expect(data.Message).toBe("Yay, a space has opened up and you are now registered for");
        expect(data.EmailFlag).toBe(true);

      });

      it("should return a data string for overdue", function() {

        var data = update.status(item, 'Overdue');

        expect(data.Template).toEqual(6);
        expect(data.DueDate).toBeDefined();
        expect(data.EmailFlag).toBe(true);
      });

    });
  });
});
