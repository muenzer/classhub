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
