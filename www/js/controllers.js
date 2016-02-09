angular.module('starter.controllers', [])
.controller('TestCtrl', function($scope) {
    $scope.init = 'test';
})
.controller('DashCtrl', function($scope, $rootScope, sessionService) {
    $rootScope.loggedIn = sessionService.get('session');
})

.controller('TripsCtrl', ['$scope', '$rootScope', '$http', 'tripsService', '$location',
    function($scope, $rootScope, $http, tripsService, $location) {

        getTrips();

        function getTrips() {
            tripsService.getAll().then(function(data) {
                $rootScope.allTrips = data.data;
            });
        };


        // @todo refactor this bit
        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.addTrip = function() {
            var postData = {
                "_links": {
                    "type": {
                        "href": "http://api.travel-bruh.com/rest/type/node/itinerary"
                    }
                },
                "title": [{
                    "value": "Postman post"
                }],
                "body": [{
                    "value": "a test post from postman"
                }]
            };
            tripsService.set(postData).then(function(data) {
                getTrips();
            }).catch(function() {
                console.log('unable to add Trip');
            });
        };
        $scope.deleteTrip = function(id) {
            console.log(id);
            tripsService.delete(id).then(function(data) {
                getTrips();
            }).catch(function() {
                console.log('unable to delete');
            });
        };
    }
])

.controller('TripDetailCtrl', ['$scope', '$rootScope', '$stateParams', 'tripsService', '$location',
    function($scope, $rootScope, $stateParams, tripsService, $location) {
        tripsService.getOne($stateParams.tripId).then(function(data) {
            $rootScope.trip = data.data[0];
        });

    }
])

.controller('AccountCtrl', ['$scope', 'sessionService', '$state', '$rootScope', 'loginService',
    function($scope, sessionService, $state, $rootScope, loginService) {
        $scope.settings = {
            enableFriends: true
        };
        $scope.logout = function() {
            // @todo investigate wether logout on the server is needed
            // loginService.doLogout().then(function(data) {
            //     console.log(data);
            // });
            sessionService.delete('id');
            sessionService.delete('name');
            sessionService.delete('session');
            $state.go('login');
        };
    }
])

.controller('LoginCtrl', ['$scope', '$state', 'sessionService', 'loginService',
    function($scope, $state, sessionService, loginService) {
        $scope.user = {};
        $scope.login = function(user) {
            loginService.doLogin($scope.user.name, $scope.user.pass).then(function(data) {
                if (data.id && data.name) {
                    $state.go('tab.trips');
                    sessionService.set('id', data.id);
                    sessionService.set('name', data.name);
                    sessionService.set('session', true);
                } else {
                    // @todo add a fail message
                }
            }).catch(function() {
                // @todo add a fail message
            });
        };

        $scope.logout = function() {
            sessionService.delete('id');
            sessionService.delete('name');
            sessionService.delete('session');
        };

        $scope.toDash = function() {
            $state.go('tab.dash');
        }
    }
]);
