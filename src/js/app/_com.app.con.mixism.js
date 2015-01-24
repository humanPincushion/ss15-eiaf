'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', '$rootScope', '$state', function($scope, $localStorage, $rootScope, $state) {
  // includes main audio player controls.
  
  $scope.playlist = [];
  $scope.currentPlaylist = [];
  
  // state params need to trigger a playlist update.
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.$broadcast('filterChange', toParams.filter);
  });
  
}]);
