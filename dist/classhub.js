angular.
module('classhub',[
	'data',
	'constants'
]);

angular.module('constants', []);
angular.module('data', ['constants', 'ngResource']);
angular.module('classhub').
service('classesService', classesService);

classesService.$inject = ['dataFactory', 'participantsFactory'];
function classesService(dataFactory, participantsFactory) {
  var service = this;

  //download classes
  var classes = dataFactory.classes.query();

  //calculate earliest date
  classes.$promise.then(function(response) {
    earliestDate();
  });

  service.get = function () {
    return classes;
  };

  //add new class
  service.addClass = function(newClassTitle) {
    newclass = dataFactory.classes.save({title: newClassTitle});

    newclass.$promise.then(function(response) {
      classes.push(newclass);
    });
  };

  //get individual class
  service.getClass = function(classid) {

    return getByID(classid);
  };

  //remove class
  service.removeClass = function(classid) {
    var index = getIndex(classid);
    console.log(index);

    title = classes[index].title || "No Title";
    response = confirm("Delete " + title + "?");

    if(!response) {
      return;
    }

    classes.splice(index, 1);
    dataFactory.classes.delete({id:classid});
  };

  //update class
  service.updateClass = function(classItem) {
    var classid = classItem.id;
    var index = getIndex(classid);

    dataFactory.classes.update({ id:classid }, classItem);
  };

  //add session
  service.addSession = function(classItem) {
    if (typeof classItem.sessions == 'undefined') {
      classItem.sessions = [];
    }

    newId = dataFactory.id.get();

    newId.$promise.then(function(response) {
      newSession = {
        class: classItem.id,
        id: newId.id
      };

      classItem.sessions.push(newSession);
      service.update(classItem);
      });

  };

  //remove session
  service.removeSession = function(classItem, index) {
    title = classItem.sessions[index].title;
    response = confirm("Delete " + title + "?");

    if(!response) {
      return;
    }

    classItem.sessions.splice(index, 1);
    service.update(classItem);
  };

  service.getParticipants = function(classid, sessions) {
    angular.forEach(sessions, function(session){

      var classsession = classid + "#" + session.id;

      var participants = new participantsFactory(classsession);

      //load participants
      session.participants = participants.get();

      session.participants.$promise.then(function(response) {
        //count total participants, expect unenrolled
        session.totalSize = countParticipants(session.participants);
        //check for waitlist
        session.waitlist = waitlist(session.totalSize, session.size);
      });
    });
  };


  dateObject = function(date) {
    return(new Date(date));
  };

  dateTime = function(date) {
    return(date.getTime());
  };

  getByID = function(classid) {
    var classItem = classes.find(function (item) {
      return item.id === classid;
    });
    return classItem;
  };

  getIndex = function (classid) {
    for (var i = 0; i < classes.length; i++) {
      if(classes[i].id === classid) {
        return i;
      }
    }
  };

  service.types = ['Class', 'Workshop', 'Open Studio', 'Private'];

  earliestDate = function() {
    classes.forEach(function(item) {
      item.earliestDate = Infinity;
      if(typeof(item.sessions) === 'undefined') {
        return;
      }
      item.sessions.forEach(function(session) {
        if (!session.disabled & session.date < item.earliestDate) {
          item.earliestDate = session.date;
        }
      });
    });
  };

  function countParticipants(participants) {
    var count = participants.filter(function(item) {
       return item.PaymentStatus != "Unenrolled";
    }).reduce( function( acc, cur ) {
      return acc + parseInt(cur.Number);
    }, 0 );

    return count;
  }

  function waitlist(totalSize, size) {
    if(totalSize >= size) {
      return true;
    } else {
      return false;
    }
  }
}

angular.module('data')
    .service('dataFactory', ['$http', 'API', '$resource', function ($http, API, $resource) {

        this.participants = $resource(API.URL + API.STAGE + '/participants/:coursesession/:emailaddress',
            {coursesession: '@coursesession', emailaddress: '@emailaddress'},
            {
              update: { method: 'PATCH'}
            }
          );
        this.classes = $resource(API.URL + API.STAGE + '/classes/:id',
            {id: '@id'},
            {
              update: { method: 'PATCH'}
            }
          );

        this.contact = $resource(API.URL + API.STAGE + '/contact');
        this.id = $resource(API.URL + API.STAGE + '/id');

        this.getCategories = function () {
            return $http.get('categories.json');
        };

        this.getClasses = function () {
            return $http.get('classes.json');
        };

        this.getClass = function (id) {
            return $http.get(id + '.json');
        };

        this.getSessions = function () {
            return $http.get('sessions.json');
        };

        this.getParticipants = function() {
            return $http.get(API.URL + API.STAGE + '/participants');
        };
    }]);

angular.module('classhub').
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

angular.module('classhub').
service('registrationService', RegistrationService);

function RegistrationService() {
  var service = this;

  service.addClassInfo = function(classItem, newParticipant) {

    newParticipant.CourseSession = classItem.id + "#" + classItem.session.id;
    newParticipant.Cost = classItem.price;
    newParticipant.ClassName = classItem.title;
    newParticipant.Date = classItem.session.date;
    newParticipant.Type = classItem.type;
    newParticipant.SessionName = classItem.session.title;

    return newParticipant;
  };

  service.newStatus = function (waitlist) {
    var newStatus;
    if(waitlist) {
      newStatus = 'Wait List';
    } else {
      newStatus = 'Registered';
    }

    return newStatus;
  };

  service._calcDueDate = function(classDateMS, cutoffDays, graceDays) {
    var today = Date.now();
    var dueDateMS = classDateMS - (cutoffDays * 24*3600*1000);

    if(today > dueDateMS) { //Too close to cutoff
      dueDateMS = today + (graceDays * 24*3600*1000);
      if(dueDateMS > classDateMS) {
        dueDateMS = classDateMS;
      } if(dueDateMS < today) {
        dueDateMS = today;
      }
    }

    return dueDateMS;
  };

  service.updateStatus = function(participantData, newStatus) {
    var classDate = participantData.Date;
    var number = participantData.Number;
    var dueDate;

    var participant = {};
    participant.EmailFlag = false;

    switch(newStatus) {
      case "Wait List":
      participant.EmailFlag = true;
      participant.Template = 3;
      participant.DueDate = 0;
      participant.Payment = 0;
      break;
      case "Registered":
      participant.EmailFlag = true;
      if(participantData.Type === 'Class') {
        participant.Template = 2;
        participant.Payment = 50 * number;
        dueDate = service._calcDueDate(classDate, 45, 3);
        participant.DueDate = dueDate;
      } else if (participantData.Type === 'Workshop') {
        participant.Template = 4;
        participant.Payment = participantData.Cost * number;
        dueDate = service._calcDueDate(classDate, 14, 2);
        participant.DueDate = dueDate;
      }
      if(participantData.PaymentStatus === 'Wait List') {
        participant.Message = "Yay, a space has opened up and you are now registered for";
      } else {
        participant.Message = "Thank you for registering for";
      }

      break;
      case "Overdue":
      participant.EmailFlag = true;

      participant.Template = 6;
      dueDate = service._calcDueDate(classDate, 5, 5);
      participant.DueDate = dueDate;
      break;
      case "Confirmed":
      break;
      case "Unenrolled":
      participant.EmailFlag = true;
      participant.Template = 8;
      break;
    }

    participant.PaymentStatus = newStatus;
    return participant;
  };

}

angular
.module('constants')
.constant("API", {
	"URL": "https://7ryzk48yuc.execute-api.eu-central-1.amazonaws.com/",
	"STAGE": "dev"
})
.constant("STATUS", {
	"OPTIONS": ['Registered', 'Confirmed', 'Wait List', 'Overdue', 'Unenrolled', 'Delete']
});


