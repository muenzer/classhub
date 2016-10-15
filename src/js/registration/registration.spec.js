describe("A registration service that", function () {
  var registrationService;
  var newParticipant;

  beforeEach(function () {
    module('classhub');

    inject(function ($injector) {
      registrationService = $injector.get('registrationService');
    });
  });

  beforeEach(function () {
    newParticipant = {
      EmailAddress: "chris.muenzer@gmail.com",
      Name: "Chris Muenzer",
      Number: 2
    };
  });

  it("should exist", function () {
    expect(registrationService).toBeDefined();
  });

  describe("adds class info", function () {
    var classItem;
    beforeEach(function () {
      classItem = {
        id: 999,
        title: "Some Class",
        session: {
          id: 999,
          date: 1000000
        },
        price: 75,
        type: 'Workshop'
      };
    });

    it("should return a participant", function () {
      newParticipant = registrationService.addClassInfo(classItem, newParticipant);

      expect(newParticipant.CourseSession).toBe("999#999");
      expect(newParticipant.Cost).toBe(75);
    });
  });

  describe("checks wait list", function () {
    it("should return a Wait List status", function () {
      newStatus = registrationService.newStatus(true);
      expect(newStatus).toBe("Wait List");
    });
    it("should return a Registered status", function () {
      newStatus = registrationService.newStatus(false);
      expect(newStatus).toBe("Registered");
    });
  });

  describe("function to calcluate due dates for payment", function(){
    it("should return a date 30 days before class", function() {
      var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

      jasmine.clock().mockDate(baseTime);

      var classDate = new Date(2016, 9, 15); //Class date is October 15th 2016 (date is 0 indexed)

      expect(registrationService._calcDueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 8, 15).getTime());
    });
    it("should return a date 5 days from today", function() {
      var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

      jasmine.clock().mockDate(baseTime);

      var classDate = new Date(2016, 7, 15); //Class date is August 15th 2016 (date is 0 indexed)

      expect(registrationService._calcDueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 7, 6).getTime());
    });
    it("should return class date", function() {
      var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

      jasmine.clock().mockDate(baseTime);

      var classDate = new Date(2016, 7, 3); //Class date is August 3rd 2016 (date is 0 indexed)

      expect(registrationService._calcDueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 7, 3).getTime());
    });
    it("should return todays date", function() {
      var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

      jasmine.clock().mockDate(baseTime);

      var classDate = new Date(2016, 6, 1); //Class date is July 1st 2016 - in the past (date is 0 indexed)

      expect(registrationService._calcDueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 7, 1).getTime());
    });
  });

  describe('that updates the participant status', function() {
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

    it("should return a participant for a new class", function() {

      var participant = registrationService.updateStatus(item, 'Registered');

      expect(participant.Template).toEqual(2);
      expect(participant.Payment).toEqual(100);
      expect(participant.DueDate).toBeDefined();
      expect(participant.EmailFlag).toBe(true);
      expect(participant.Message).toBeDefined();
    });
    it("should return a participant for a new workshop", function() {
      item.Type = "Workshop";

      var participant = registrationService.updateStatus(item, 'Registered');

      expect(participant.Template).toEqual(4);
      expect(participant.Payment).toEqual(400);
      expect(participant.DueDate).toBeDefined();
      expect(participant.EmailFlag).toBe(true);
    });
    it("should return a participant for a waitlist", function() {

      var participant = registrationService.updateStatus(item, 'Wait List');

      expect(participant.Template).toEqual(3);
      expect(participant.EmailFlag).toBe(true);
    });
    it("should return a welcome message", function() {

      item.PaymentStatus = "Wait List";
      var participant = registrationService.updateStatus(item, 'Registered');

      expect(participant.Message).toBe("Yay, a space has opened up and you are now registered for");
      expect(participant.EmailFlag).toBe(true);

    });
    it("should return a participant for overdue", function() {

      var participant = registrationService.updateStatus(item, 'Overdue');

      expect(participant.Template).toEqual(6);
      expect(participant.DueDate).toBeDefined();
      expect(participant.EmailFlag).toBe(true);
    });

  });
});
