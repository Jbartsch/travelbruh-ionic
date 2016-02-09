describe("Account controller", function() {

    var $scope, ctrl, $timeout;

    beforeEach(function() {

        module("starter.controllers");
        module('ui.router');
        module('starter.services');

        inject(function(_$rootScope_, _$state_, $controller, $q, _$timeout_, _loginService_, _sessionService_) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            loginService = _loginService_;
            sessionService = _sessionService_;
            ctrl = $controller('LoginCtrl', {
                $scope: $scope
            });
            deferred = $q.defer();
            spyOn(loginService, 'doLogin').and.returnValue(deferred.promise);
            spyOn(sessionService, 'set');
            spyOn(sessionService, 'delete').and.callFake(function(key) {});
            spyOn($state, 'go').and.callFake(function(state) {});
        });

    });

    // Test 1: The simplest of the simple.
    // here we're going to make sure the $scope variable
    // exists evaluated.
    it("should have a $scope variable", function() {
        expect($scope).toBeDefined();
    });
    it("should delete the id from the local storage", function() {
        $scope.logout();
        expect(sessionService.delete).toHaveBeenCalledWith('id');
    });
    it("should delete the name from the local storage", function() {
        $scope.logout();
        expect(sessionService.delete).toHaveBeenCalledWith('name');
    });
    it("should delete the session from the local storage", function() {
        $scope.logout();
        expect(sessionService.delete).toHaveBeenCalledWith('session');
    });
});
