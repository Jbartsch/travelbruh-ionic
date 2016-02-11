angular.module('starter.controllers', ['google.places', 'ngMessages'])

.controller('DashCtrl', function($scope, $rootScope, sessionService) {

    $scope.updateStatus = function() {
        $rootScope.session = sessionService.get('session');
    };
    $scope.id = sessionService.get('id');
    $scope.name = sessionService.get('name');
    $rootScope.username = sessionService.get('username');
})

.controller('TripsCtrl', ['$scope', '$rootScope', '$state', 'tripsService',
    function($scope, $rootScope, $state, tripsService) {
        $scope.getTrips = function getTrips() {
            tripsService.getAll().then(function(data) {
                $rootScope.allTrips = data.data;
            });
        };
        $scope.doRefresh = function() {
            $scope.getTrips();
        };
        // @todo refactor this bit
        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.addTrip = function() {
            $state.go('tab.trip-form');
        };
        $scope.deleteTrip = function(id) {
            tripsService.delete(id).then(function(data) {
                $scope.getTrips();
            }).catch(function() {});
        };
    }
])

.controller('TripsFormCtrl', ['$scope', '$state', 'tripsService', function($scope, $state, tripsService) {

    $scope.cancel = function() {
        $state.go('tab.trips');
    };

    $scope.addTrip = function(destination, body, from, to) {
        var postData = {};
        postData._links = {
            "type": {
                "href": "http://api.travel-bruh.com/rest/type/node/itinerary"
            }
        };
        postData.title = [];
        postData.title[0] = {
            "value": destination
        };
        postData.body = [];
        postData.body[0] = {
            "value": body
        };

        postData.body.field_end_date = [];
        postData.body.field_end_date[0] = {
            'value': from
        };
        postData.body.field_date = [];
        postData.body.field_date[0] = {
            'value': to
        };



        tripsService.set(postData).then(function(data) {
            console.log(data);
            $state.go('tab.trips');
            tripsService.getAll();
        }).catch(function(data) {});
    };
}])

.controller('TripDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams',
    'tripsService', '$location',
    function($scope, $rootScope, $state, $stateParams, tripsService, $location) {

        $scope.getTrip = function() {
            tripsService.getOne($stateParams.tripId).then(function(data) {
                $rootScope.trip = data.data[0];
            });
        };
        $scope.edit = function(id) {
            $state.go('tab.trip-detail-edit', id);
        };

    }
])

.controller('TripDetailEditCtrl', ['$scope', '$rootScope', '$stateParams', 'tripsService', '$location',
    function($scope, $rootScope, $stateParams, tripsService, $location) {
        tripsService.getOne($stateParams.tripId).then(function(data) {
            $rootScope.trip = data.data[0];

        });

    }
])

.controller('AccountCtrl', ['$scope', 'sessionService', '$state', '$rootScope', 'loginService',
    function($scope, sessionService, $state, $rootScope, loginService) {
        $scope.logout = function() {
            loginService.doLogout();
            $state.go('login.home');

        };
    }
])

.controller('HomeCtrl', ['$scope', '$state', 'sessionService', 'loginService',
    function($scope, $state, sessionService, loginService) {
        $scope.user = {};
        $scope.goRegister = function() {
            $state.go('login.register');
        };
        $scope.goLogin = function() {
            $state.go('login.login');

        };
    }
])

.controller('LoginCtrl', ['$scope', '$state', 'sessionService', 'loginService',
    function($scope, $state, sessionService, loginService) {
        $scope.user = {};
        $scope.login = function(user) {
            loginService.doLogin($scope.user.name, $scope.user.pass)
                .then(function(data) {
                    $scope.data = data;
                    if ($scope.data.id && $scope.data.name) {
                        $scope.user.name = '';
                        $scope.user.pass = '';
                        $state.go('tab.trips');
                    } else {
                        $scope.error = 'Login data incorrect';
                    }
                }).catch(function() {
                    // @todo add a fail message
                    $scope.error = 'Something went wrong, try again!';

                });
        };
        $scope.toHome = function() {
            $state.go('login.home');
        }
    }
])

.controller('RegisterCtrl', ['$scope', '$state', 'sessionService', 'loginService',
    function($scope, $state, sessionService, loginService) {
        $scope.user = {};
        $scope.register = function(user) {
            loginService.doRegister($scope.user.email, $scope.user.email, $scope.user.pass)
                .then(function(data) {
                    if (data) {
                        $scope.data = data;
                        if ($scope.data.status === 201) {
                            $scope.user.name = '';
                            $scope.user.email = '';
                            $scope.user.pass = '';
                            $scope.error = 'Login success';
                            $state.go('tab.trips');
                        } else {
                            $scope.error = 'Login data incorrect';
                        }
                    } else {
                        $scope.error = 'Login data incorrect';
                    }

                }).catch(function() {
                    // @todo add a fail message
                    $scope.error = 'There has been an error!';

                });
        };
    }
]);
