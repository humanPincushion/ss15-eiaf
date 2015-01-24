'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', '$rootScope', '$state', 'playerSvc', 'mediaSvc', function($scope, $localStorage, $rootScope, $state, playerSvc, mediaSvc) {
  // includes main audio player controls.
  
  $scope.playlist = [];
  $scope.currentPlaylist = [];
  $scope.title = false;
  $scope.currentTrack = [];
  
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
  
  $rootScope.$on('trackStarted', function() {
    $scope.currentTrack = playerSvc.getCurrentTrack();
    mediaSvc.getMeta( $scope.currentTrack.urls[0] ).then(function(media) {
      $scope.currentTrack.media = media;
      console.log( $scope.currentTrack );
    });
    
  });
  
  $scope.playTrack = function(key) {
    playerSvc.playTrack(key);
  };
  
}]);
