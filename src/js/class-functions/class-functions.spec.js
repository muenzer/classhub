describe('The class function module has a', function() {

  var classFunctions;

  beforeEach(function () {
    module('sharedAssets');

    inject(function ($injector) {
      classFunctions = $injector.get('classFunctions');
    });
  });

  describe('set of helper functions', function() {
    it("that should exist", function() {
      expect(classFunctions).toBeDefined();
    });
  });

  describe('function to calculate the earliest date', function() {

    var classes = [
      {
        "sessions":
        [
          {"id":"987","title":"Tuesday Mornings - 9:00am to 12:00pm - Begins August 30th","class":"748","date":1472508000000,"disabled":true,"size":2},
          {"id":"992","title":"Wednesday Evenings - 6:30pm to 9pm - Begins August 24th","class":"748","date":1471989600000,"disabled":true,"size":3},
          {"id":"1096","title":"Thursday Mornings 9am to 12pm - Begins August 25th","class":"748","date":1472076000000,"disabled":true,"size":3},
          {"id":"997","title":"Tuesday Evenings - 6:30pm to 9pm - Begins August 30th","class":"748","date":1472548602100,"disabled":true,"size":2},
          {"id":"1147","title":"Thursday Mornings - 9:00am to 12:00pm - Begins October 6th","class":"748","date":1475716073000,"size":2},
          {"id":"1150","title":"Wednesday Evenings - 6:30pm to 9:30pm - Begins October 5th","class":"748","date":1475681566600,"size":2},
          {"id":"1148","title":"Tuesday Mornings - 9:00am to 12:00pm - Begins October 25th","class":"748","date":1477374983900,"size":2},
          {"id":"1149","title":"Tuesday Evenings - 6:30pm to 9:30pm - Begins October 25th","class":"748","date":1477374991500,"size":2},
          {"id":"rykWI8so","title":"Wednesday Evenings - 6:30pm to 9:30pm - Begins November 9th","class":"748","date":1478646000000,"size":2},
          {"id":"ryb7LLis","title":"Thursday Mornings - 9:00am to 12:00pm - Begins November 10th","class":"748","date":1478732400000,"size":2}
        ],
      },
      {
        "sessions":
        [
          {"id":"1164","title":"Saturday Morning - 11:00am to 12:00pm","class":"451","date":1475877600000,"size":10},
          {"id":"1165","title":"Saturday Afternoon - 2:00pm to 3:00pm","class":"451","date":1475877600000,"disabled":true,"size":10}
        ]
      }
    ];

    describe('that should create an earliest data', function() {
      beforeEach(function() {
        classFunctions.date(classes);
      });

      it("should create an earliest date", function () {

        expect(classes[0].earliestDate).toBeDefined();
      });
      it("should create an earliest date of October 5th", function() {
        expect(classes[0].earliestDate).toBe(1475681566600);
      });
      it("should create an earliest date of October 8th", function() {
        expect(classes[1].earliestDate).toBe(1475877600000);
      });
    });

  });

  describe('function to load participants', function() {
    it('that should exist', function(){
      expect(classFunctions.participants).toBeDefined();
    });
  });

  describe('function to count participants', function() {
    it('that should exist', function(){
      expect(classFunctions.countParticipants).toBeDefined();
    });
    var participants = [
      {
        Number: 3,
        PaymentStatus: "Confirmed"
      },
      {
        Number: "1",
        PaymentStatus: "Wait List"
      },
      {
        Number: 1,
        PaymentStatus: "Unenrolled"
      }
    ];

    var count = 0;

    beforeEach(function() {
      count = classFunctions.countParticipants(participants);
    });

    it('that should equal 4', function() {
      expect(count).toBe(4);
    });

  });
  describe('function to check for wait list', function() {
    it('that should exist', function(){
      expect(classFunctions.waitlist).toBeDefined();
    });
    it('that should return true', function() {
      expect(classFunctions.waitlist(4,2)).toBeTruthy();
    });
    it('that should return true', function() {
      expect(classFunctions.waitlist(2,2)).toBeTruthy();
    });
    it('that should return false', function() {
      expect(classFunctions.waitlist(0,2)).toBeFalsy();
    });
  });
});
