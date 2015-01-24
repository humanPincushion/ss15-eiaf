'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', '$rootScope', '$state', 'playerSvc', function($scope, $localStorage, $rootScope, $state, playerSvc) {
  // includes main audio player controls.
  
  $scope.playlist = [];
  $scope.currentPlaylist = [];
  $scope.title = false;
  
  function updatePlaylistTitle(filter) { 
    if(filter === undefined)
      return $scope.title = '';
    
    $scope.title = false;
  }
  
  // state params need to trigger a playlist update.
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.$broadcast('filterChange', toParams.filter);
    updatePlaylistTitle( toParams.filter );
  });
  
  $scope.playTrack = function(trackUrl) {
    playerSvc.playTrack(trackUrl);
  };
  
}]);
