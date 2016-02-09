describe("Login controller", function() {

    var $scope,
        _$rootScope_,
        ctrl,
        $timeout,
        $state,
        sessionService,
        loginService;

    beforeEach(function() {

        module('starter.controllers');
        module('ui.router');
        module('starter.services');

        // INJECT! This part is critical
        // $rootScope - injected to create a new $scope instance.
        // $controller - injected to create an instance of our controller.
        // $q - injected so we can create promises for our mocks.
        // _$timeout_ - injected to we can flush unresolved promises.
        inject(function(_$rootScope_, $state, $controller, $q, _$timeout_, _loginService_, _sessionService_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            loginService = _loginService_;
            sessionService = _sessionService_;
            ctrl = $controller('LoginCtrl', {
                $scope: $scope,
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

    // Check existence of all $scope variables
    it("should have a $scope variable", function() {
        expect($scope).toBeDefined();
    });
    it("should have a $scope.user variable", function() {
        expect($scope.user).toBeDefined();
    });
    it("should have a $scope.login variable", function() {
        expect($scope.login).toBeDefined();
    });
    it("should have a $scope.logout variable", function() {
        expect($scope.logout).toBeDefined();
    });
    it("should have a $scope.toDash variable", function() {
        expect($scope.toDash).toBeDefined();
    });

    // Test the login
    it('should get an error when no name and password is provided', function() {
        deferred.reject();
        $scope.login();
        $rootScope.$apply();
        expect($scope.error).toBe('There has been an error!');
    });
    it('should have called the login service', function() {
        deferred.resolve({
            'id': 'someId',
            'name': 'someName'
        });
        $scope.user.name = 'admin';
        $scope.user.pass = 'password';
        $scope.login($scope.user.name, $scope.user.pass);
        $rootScope.$apply();
        expect(loginService.doLogin).toHaveBeenCalledWith('admin', 'password');
    });
    it('should get back data after successful login', function() {
        deferred.resolve({
            'id': 'someId',
            'name': 'someName'
        });
        $scope.login($scope.user.name, $scope.user.pass);
        $rootScope.$apply();
        expect($scope.data.id).toBe('someId');
        expect($scope.data.name).toBe('someName');
    });
    it('should get back data after unsuccessful login', function() {
        deferred.resolve('id and name not set');
        $scope.login($scope.user.name, $scope.user.pass);
        $rootScope.$apply();
        expect($scope.error).toBe('Login data incorrect')
    });
    it('should call the session Service to store the received data locally', function() {
        deferred.resolve({
            'id': 'someId',
            'name': 'someName'
        });
        $scope.login($scope.user.name, $scope.user.pass);
        $rootScope.$apply();
        expect(sessionService.set).toHaveBeenCalled();
    });

    // Test the logout
    it('should have called the logout function and delete the local data', function() {
        $scope.logout();
        expect(sessionService.delete).toHaveBeenCalledWith('id');
        expect(sessionService.delete).toHaveBeenCalledWith('name');
        expect(sessionService.delete).toHaveBeenCalledWith('session');
    });

});
