angular.module('classhub').
service('registrationService', RegistrationService);

function RegistrationService() {
  var service = this;

  service.newRegistration = function (classItem, newParticipant) {
    newParticipant = service._addClassInfo(classItem, newParticipant);

    var newStatus = service._newStatus(classItem.session.waitlist);

    newParticipant = service._updateRegistration(newParticipant, newStatus);

    return newParticipant;
  };

  service._addClassInfo = function(classItem, newParticipant) {

    newParticipant.CourseSession = classItem.id + "#" + classItem.session.id;
    newParticipant.Cost = classItem.price;
    newParticipant.ClassName = classItem.title;
    newParticipant.Date = classItem.session.date;
    newParticipant.Type = classItem.type;

    return newParticipant;
  };

  service._newStatus = function (waitlist) {
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

  service._updateStatus = function(participant, newStatus) {
    var classDate = participant.Date;
    var number = participant.Number;
    var dueDate;

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
      if(participant.Type === 'Class') {
        participant.Template = 2;
        participant.Payment = 50 * number;
        dueDate = service._calcDueDate(classDate, 45, 3);
        participant.DueDate = dueDate;
      } else if (participant.Type === 'Workshop') {
        participant.Template = 4;
        participant.Payment = participant.Cost * number;
        dueDate = service._calcDueDate(classDate, 14, 2);
        participant.DueDate = dueDate;
      }
      if(participant.PaymentStatus === 'Wait List') {
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
