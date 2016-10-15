describe('The data module has a', function() {

  var dataFactory;
  var $httpBackend;
  var API;

  beforeEach(function () {
    module('data');

    inject(function ($injector) {
      dataFactory = $injector.get('dataFactory');
      $httpBackend = $injector.get('$httpBackend');
      API = $injector.get('API');
    });
  });


  describe('Users factory', function() {

    // Before each test set our injected Users factory (_Users_) to our local Users variable
    beforeEach(inject(function(_dataFactory_) {
      dataFactory = _dataFactory_;
    }));

    // A simple test to verify the Users factory exists
    it('should exist', function() {
      expect(dataFactory).toBeDefined();
    });
  });

  describe('participants resouce', function() {
    var participants = '[{"Name":"Helen Campbell","Number":"2","CourseSession":"463#1169","PaymentStatus":"Confirmed","id":"6d7ad2","EmailAddress":"helen1campbell@yahoo.co.uk"},{"Name":"Helen Jones","Number":"1","CourseSession":"463#1169","PaymentStatus":"Wait List","id":"6d7zd2","EmailAddress":"hjones@gmail.com"}]';
    var id = "463#1169";

  it('that should return participants', function() {
    $httpBackend.whenGET(API.URL + API.STAGE + '/participants/463%231169').respond(participants);
    var returnedParticipants = dataFactory.participants.query({coursesession: id});
    returnedParticipants.$promise.then(function(response) {
      expect(returnedParticipants[0].Name).toContain("Helen Campbell");
      expect(returnedParticipants[1].Name).toContain("Helen Jones");
    });
    $httpBackend.flush();
  });

});
});
