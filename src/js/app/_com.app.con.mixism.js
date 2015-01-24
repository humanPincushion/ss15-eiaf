'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', '$rootScope', function($scope, $localStorage, $rootScope) {
  // includes main audio player controls.
  
  $scope.playlist = [];
  $localStorage.playlist = [];
  
  $scope.$watch('playlist', function() {
    $localStorage.playlist = $scope.playlist;
  });
  
  // state params need to trigger a playlist update.
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.$broadcast('filterChange', toParams.filter);
  });
  
}]);