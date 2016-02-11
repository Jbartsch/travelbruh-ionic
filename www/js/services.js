angular.module('starter.services', [])


.service('loginService', ['$http', '$rootScope', '$location', '$window', '$q',
    'sessionService', 'Base64',
    function($http, $rootScope, $location, $window, $q, sessionService, Base64) {
        var loginService = {};

        loginService.doLogin = function(username, password) {
            return $http({
                method: 'POST',
                data: {
                    "username": username,
                    "password": password
                },
                url: $rootScope.baseUrl + '/api/v1/user/login',
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            }).then(function(response) {
                if (response.data.id && response.data.name) {
                    var authdata = Base64.encode(username + ':' + password);
                    sessionService.set('authdata', authdata);
                    sessionService.set('id', response.data.id);
                    sessionService.set('name', response.data.name);
                    sessionService.set('username', username);
                    sessionService.set('password', password);
                    sessionService.set('session', true);
                }
                return response.data;
            }).catch(function(response) {});

        }

        loginService.doRegister = function(username, email, password) {
            function getToken() {
                return $http({
                    method: 'GET',
                    url: $rootScope.baseUrl + '/rest/session/token'

                }).then(function(response) {
                    $rootScope.csrfToken = response.data;
                });
            };
            getToken();
            return $http({
                method: 'POST',
                data: {
                    "name": username,
                    "mail": email,
                    'pass': password,
                    "status": 1
                },
                url: $rootScope.baseUrl + '/entity/user',
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json",
                    'X-CSRF-Token': $rootScope.csrfToken
                }
            }).then(function(response) {
                if (response.status === 201) {
                    var authdata = Base64.encode(username + ':' + password);
                    sessionService.set('authdata', authdata);
                    sessionService.set('username', username);
                    sessionService.set('password', password);
                    sessionService.set('session', true);
                }
            }).catch(function(response) {});
            console.log('user not created');
        }

        loginService.doLogout = function() {
            sessionService.delete('id');
            sessionService.delete('name');
            sessionService.delete('session');
            sessionService.delete('authdata');
            sessionService.delete('username');
            sessionService.delete('password');

        }

        return loginService;
    }
])

.service('sessionService', ['$window',
    function($window) {
        return {
            set: function(key, value) {
                localStorage.setItem(key, value);
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

.service('tripsService', ['$http', '$rootScope', 'sessionService',
        function($http, $rootScope, sessionService) {

            function getToken() {
                return $http({
                    method: 'GET',
                    url: $rootScope.baseUrl + '/rest/session/token'

                }).then(function(response) {
                    $rootScope.csrfToken = response.data;
                });
            };
            getToken();

            var authdata = sessionService.get('authdata')
            var username = sessionService.get('username')
            return {
                set: function(data) {
                    return $http({
                        method: 'POST',
                        url: $rootScope.baseUrl + '/entity/node',
                        data: data,
                        headers: {
                            'Content-Type': 'application/hal+json',
                            'Accept': 'application.json',
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
                        url: $rootScope.baseUrl + '/api/v1/itinerary/all/' + username,
                        headers: {
                            'content-type': 'application/json',
                        }
                    }).then(function(response) {
                        $rootScope.allTrips = response.data;
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
