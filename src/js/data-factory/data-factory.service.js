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
