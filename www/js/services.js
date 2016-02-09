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
                url: $rootScope.baseUrl + '/api/v2/user/login',
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            }).then(function(response) {
                return response.data;
            });

        }
        loginService.doLogout = function(name, pass) {
            // Logout on the server code here


            // $http({
            //         method: 'GET',
            //         withCredentials: true,
            //         url: $rootScope.baseUrl + '/rest/session/token',
            //         headers: {
            //             'Content-Type': 'application/hal+json',
            //         }
            //     }).then(function successCallback(response) {
            //         $http({
            //             method: 'POST',
            //             withCredentials: true,
            //             url: 'http://travelbruh.localhost/api/v2/user/logout',
            //             headers: {
            //                 "content-type": "application/json",
            //                 "accept": "application/json",
            //                 'X-CSRF-Token': response.data
            //             }
            //         }).then(function successCallback(response) {
            //             // $cookies.remove($window.sessionStorage.tokenName);
            //             window.localStorage['loggedIn'] = false;
            //             $rootScope.loggedIn = false;
            //         }, function errorCallback(response) {
            //             console.log('error ' + response.status);

            //         });
            //     }, function errorCallback(response) {

            //     });
            return $http({
                method: 'POST',
                url: $rootScope.baseUrl + '/api/v2/user/logout',
                headers: {
                    "content-type": "application/json"
                }
            }).then(function(response) {
                console.log(response);
                return response.data;
            });
        }

        return loginService;
    }
])

.service('sessionService', ['$window',
    function($window) {

        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key) {
                return localStorage.getItem(key);
            },
            delete: function(key) {
                localStorage.removeItem(key);
            }
        }
    }
])

.service('tripsService', ['$http', '$rootScope', 'Base64',
    function($http, $rootScope, Base64) {
        // var authdata = Base64.encode(username + ':' + password);
        var authdata = Base64.encode('admin:password');

        return {
            set: function(data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.baseUrl + '/entity/node',
                    data: data,
                    headers: {
                        'content-type': 'application/hal+json',
                        'Authorization': 'Basic ' + authdata,
                        'X-CSRF-Token': $rootScope.csrfToken
                    }
                }).then(function(response) {
                    return response;
                });
            },
            getOne: function(id) {
                return $http({
                    method: 'GET',
                    url: $rootScope.baseUrl + '/api/v1/itinerary/' + id,
                    headers: {
                        "content-type": "application/json",
                    }
                }).then(function(response) {
                    return response;
                });
            },
            getAll: function() {
                return $http({
                    method: 'GET',
                    url: $rootScope.baseUrl + '/api/v1/itinerary',
                    headers: {
                        "content-type": "application/json",
                    }
                }).then(function(response) {
                    return response;
                });
            },
            delete: function(id) {
                return $http({
                    method: 'DELETE',
                    url: $rootScope.baseUrl + '/node/' + id,
                    headers: {
                        'Content-Type': 'application/hal+json',
                        'Authorization': 'Basic ' + authdata,
                        'X-CSRF-Token': $rootScope.csrfToken

                    }
                }).then(function(response) {
                    return response;
                });

            },
        }
    }
])
.factory('Base64', function() {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
