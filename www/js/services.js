angular.module('starter.services', [])


.service('loginService', ['$http', '$rootScope', '$location', '$window', '$q',
    function($http, $rootScope, $location, $window, $q) {
        var loginService = {};

        loginService.doLogin = function(name, pass) {
            return $http({
                method: 'POST',
                data: {
                    "username": name,
                    "password": pass
                },
                url: 'http://travelbruh.localhost/api/v2/user/login',
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            }).then(function(response){
                return response.data;
            })
            ;

        }
        return loginService;
    }
]);
