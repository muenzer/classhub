angular.module('sharedAssets').
factory('participantsFactory', participantsFactory);

participantsFactory.$inject = ['dataFactory'];
function participantsFactory(dataFactory) {
  console.log("participantsFactory");
  var factory = function (coursesession) {
    //var coursesession = classid + "#" + sessionid;
    return new participantsFactoryService(coursesession, dataFactory);
  };
  return factory;
}

function participantsFactoryService(id, dataFactory) {
  var service = this;
  service.id = id;

  var participants = dataFactory.participants.query({coursesession: id});

  service.get = function () {
    return participants;
  };
}
