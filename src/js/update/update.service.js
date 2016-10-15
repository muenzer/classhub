angular.module('update')
.service('update', ['calc', function(calc){
	this.status = function(item, newStatus) {
		var data = {};
		var classDate = item.Date;
		var number = item.Number;
		var dueDate;

		data.PaymentStatus = newStatus;
		data.EmailFlag = false;

		switch(newStatus) {
			case "Wait List":
			data.EmailFlag = true;
			data.Template = 3;
			data.DueDate = 0;
			data.Payment = 0;
			break;
			case "Registered":
			data.EmailFlag = true;
			if(item.Type === 'Class') {
				data.Template = 2;
				data.Payment = 50 * number;
				dueDate = calc.DueDate(classDate, 45, 3);
				data.DueDate = dueDate;
			} else if (item.Type === 'Workshop') {
				data.Template = 4;
				data.Payment = item.Cost * number;
				dueDate = calc.DueDate(classDate, 14, 2);
				data.DueDate = dueDate;
			}
			if(item.PaymentStatus === 'Wait List') {
				data.Message = "Yay, a space has opened up and you are now registered for";
			} else {
				data.Message = "Thank you for registering for";
			}

			break;
			case "Overdue":
			data.EmailFlag = true;

			data.Template = 6;
			dueDate = calc.DueDate(classDate, 5, 5);
			data.DueDate = dueDate;
			break;
			case "Confirmed":
			break;
			case "Unenrolled":
			data.EmailFlag = true;
			data.Template = 8;
			break;
		}

		return data;
	};
}]);