describe('Application constants', function() {
	describe('for the API', function() {
		var API;

		beforeEach(module('constants'));

		beforeEach(inject(function(_API_) {
		  API = _API_;
		}));
		it('should exist', function() {
			expect(API).toBeDefined();
		});
		it('should contain the url', function() {
			expect(API.URL).toBe('https://7ryzk48yuc.execute-api.eu-central-1.amazonaws.com/');
		});
		it('should contain the api starge', function() {
			expect(API.STAGE).toBe('dev');
		});
	});
});
