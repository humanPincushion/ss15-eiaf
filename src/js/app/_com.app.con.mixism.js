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
  $scope.playerState = false;
  $scope.timeline = {};
  
  function updatePlaylistTitle(filter) { 
    if(filter === undefined)
      return $scope.title = '';
    
    $scope.title = false;
  }
  
  // state params need to trigger a playlist update.
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
    $rootScope.$broadcast('filterChange', toParams.filter);
    updatePlaylistTitle( toParams.filter );
    $scope.title = toParams.filter;
  });
  
  // when a track is playing, update the player UI.
  $rootScope.$on('trackStarted', function() {
    $scope.currentTrack = playerSvc.getCurrentTrack();
    mediaSvc.getMeta( $scope.currentTrack.urls[0] ).then(function(media) {
      $scope.currentTrack.media = media;
      $scope.playerState = true;
      //console.log( $scope.currentTrack );
    });
  });
  
  // while a track is playing we need to keep feeding the track progress info to the progress bar.
  $rootScope.$on('timelineUpdate', function() {
    $scope.timeline = playerSvc.getTimelineInfo();
    //console.log( $scope.timeline );
  });
  
  // plays a track by playlist key.
  $scope.playTrack = function(key) {
    playerSvc.playTrack(key);
  };
  
  // stops the current track and updates the player state
  $scope.togglePause = function($event) {
    $event.preventDefault();
    playerSvc.togglePause();
    $scope.playerState = !$scope.playerState;
  };
  
}]);
