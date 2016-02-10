angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .run(function($rootScope, $state, sessionService) {
        $rootScope.baseUrl = 'http://api.travel-bruh.com';
        $rootScope.reload = true;
    })
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive

        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
    })

    // Each tab has its own nav history stack:

    .state('tab.trips', {
        url: '/trips',
        views: {
            'tab-trips': {
                templateUrl: 'templates/tab-trips.html',
                controller: 'TripsCtrl'
            }
        },
        onEnter: function($state, sessionService) {
            if (!sessionService.get('session')) {
                $state.go('login');
            }
        }
    })

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        },
        onEnter: function($state, sessionService) {
            if (!sessionService.get('session')) {
                $state.go('login');
            }
        }
    })

    .state('tab.trip-form', {
        url: '/trips/add',
        views: {
            'tab-trips': {
                templateUrl: 'templates/trip-form.html',
                controller: 'TripsFormCtrl'
            }
        },
        onEnter: function($state, sessionService) {
            if (!sessionService.get('session')) {
                $state.go('login');
            }
        }
    })

    .state('tab.trip-detail', {
        url: '/trips/:tripId',
        views: {
            'tab-trips': {
                templateUrl: 'templates/trip-detail.html',
                controller: 'TripDetailCtrl'
            }
        },
        onEnter: function($state, sessionService) {
            if (!sessionService.get('session')) {
                $state.go('login');
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        },
        onEnter: function($state, sessionService) {
            if (!sessionService.get('session')) {
                $state.go('login');
            }
        }
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        onEnter: function($state, sessionService) {
            if (sessionService.get('session')) {
                $state.go('tab.trips');
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/trips');

});
