angular
.module('constants')
.constant("API", {
	"URL": "https://7ryzk48yuc.execute-api.eu-central-1.amazonaws.com/",
	"STAGE": "dev"
})
.constant("STATUS", {
	"OPTIONS": ['Registered', 'Confirmed', 'Wait List', 'Overdue', 'Unenrolled', 'Delete']
});


