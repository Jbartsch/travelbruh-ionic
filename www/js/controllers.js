angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('TripsCtrl', function($scope, $rootScope, $http, travelBruhFactory, $location) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});


})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', 'loginService', '$window', '$state',
        function($scope, $rootScope, $http, loginService, $window, $state) {
            $rootScope.user = {};
            $scope.submit = function(user) {
                loginService.doLogin($scope.user.name, $scope.user.pass).then(function(data) {
                    console.log(data);
                    if (data.id && data.name) {
                        $rootScope.user.data = data;
                        $rootScope.message = 'Login success';
                        $state.go('tab.dash');
                    } else {
                        $rootScope.message = 'Login failed';
                    }
                }).catch(function() {
                    console.log('unable to login');
                });
            };

            $scope.logout = function() {


                $http({
                    method: 'GET',
                    withCredentials: true,
                    url: $rootScope.baseUrl + '/rest/session/token',
                    headers: {
                        'Content-Type': 'application/hal+json',
                    }
                }).then(function successCallback(response) {
                    $http({
                        method: 'POST',
                        withCredentials: true,
                        url: 'http://travelbruh.localhost/api/v2/user/logout',
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json",
                            'X-CSRF-Token': response.data
                        }
                    }).then(function successCallback(response) {
                        // $cookies.remove($window.sessionStorage.tokenName);
                        window.localStorage['loggedIn'] = false;
                        $rootScope.loggedIn = false;
                    }, function errorCallback(response) {
                        console.log('error ' + response.status);

                    });
                }, function errorCallback(response) {

                });
            };



        }
    ]);
