describe('The calc module', function() {

	beforeEach(angular.mock.module('calc'));

	describe("function to calcluate due dates for payment", function(){
		var calc;

		beforeEach(inject(function(_calc_) {
		  calc = _calc_;
		}));

		it("should exist", function() {
			expect(calc).toBeDefined();
		});


		it("should return a date 30 days before class", function() {
		var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

		jasmine.clock().mockDate(baseTime);

		var classDate = new Date(2016, 9, 15); //Class date is October 15th 2016 (date is 0 indexed)

		expect(calc.DueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 8, 15).getTime());
	});
		it("should return a date 5 days from today", function() {
		var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

		jasmine.clock().mockDate(baseTime);

		var classDate = new Date(2016, 7, 15); //Class date is August 15th 2016 (date is 0 indexed)

		expect(calc.DueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 7, 6).getTime());
	});
		it("should return class date", function() {
		var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

		jasmine.clock().mockDate(baseTime);

		var classDate = new Date(2016, 7, 3); //Class date is August 3rd 2016 (date is 0 indexed)

		expect(calc.DueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 7, 3).getTime());
	});
		it("should return todays date", function() {
		var baseTime = new Date(2016, 7, 1); //Set date to August 1st 2016 (date is 0 indexed)

		jasmine.clock().mockDate(baseTime);

		var classDate = new Date(2016, 6, 1); //Class date is July 1st 2016 - in the past (date is 0 indexed)

		expect(calc.DueDate(classDate.getTime(), 30, 5)).toEqual(Date(2016, 7, 1).getTime());
	});
	});
});
