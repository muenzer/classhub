angular.module('calc')
.service('calc', function(){
	this.DueDate = function(classDateMS, cutoffDays, graceDays) {
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
});