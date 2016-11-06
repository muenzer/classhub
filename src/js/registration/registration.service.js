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

  service._calcDueDate = function(classDateString, cutoffDays, graceDays) {
    var today = Date.now();
    var classDate = new Date(classDateString);
    var dueDate = new Date(+classDate);
    dueDate.setDate(dueDate.getDate() - cutoffDays);

    if(today > dueDate) { //Too close to cutoff
      dueDate = new Date(+today);
      dueDate.setDate(dueDate.getDate() + graceDays);
      if(dueDate > classDate) {
        dueDate = new Date(+classDate);
      } if(dueDate < today) {
        dueDate = new Date(+today);
      }
    }

    dueDate.setHours(0, -dueDate.getTimezoneOffset(), 0, 0);
    dueDateString = dueDate.toISOString().substr(0,10);
    //dueDateString = dueDate.getFullYear() + '-' + (dueDate.getMonth() + 1) + '-' + dueDate.getDate();
    console.log(dueDateString);
    return dueDateString;
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
