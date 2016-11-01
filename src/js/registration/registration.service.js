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
