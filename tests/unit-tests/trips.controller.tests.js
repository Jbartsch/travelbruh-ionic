describe("Trips controller", function() {

    var $scope,
        _$rootScope_,
        ctrl,
        $timeout,
        $state,
        tripsService;

    beforeEach(function() {

        module("starter.controllers");
        module('ui.router');
        module('starter.services');

        inject(function(_$rootScope_, $state, $controller,
            $q, _$timeout_, _tripsService_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            tripsService = _tripsService_;
            ctrl = $controller('TripsCtrl', {
                $scope: $scope,
                tripsService: tripsService
            });
            deferred = $q.defer();
            spyOn(tripsService, 'getAll').and.returnValue(deferred.promise);
            spyOn($state, 'go').and.callFake(function(state) {});
        });

    });

    it("should have a $scope variable", function() {
        expect($scope).toBeDefined();
    });
    // it("should get all trips from the tripsService", function() {
    //     deferred.resolve({'data':'trips Data'});
    //     $scope.getTrips();
    //     $rootScope.$apply();
    //     expect($rootScope.allTrips).toBe('trips Data');
    // });

});
