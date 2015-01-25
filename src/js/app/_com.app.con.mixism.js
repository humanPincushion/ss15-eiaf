'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', '$timeout', '$rootScope', '$state', 'playerSvc', 'mediaSvc', 'socialSvc', 'ngDialog', function($scope, $localStorage, $timeout, $rootScope, $state, playerSvc, mediaSvc, socialSvc, ngDialog) {
  
  $scope.playlist = [];
  $scope.currentPlaylist = [];
  $scope.title = false;
  $scope.currentTrack = [];
  $scope.currentId = 0;
  $scope.playerState = false; // should the player be visible?
  $scope.playState = false; // is it playing or paused?
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
    $scope.currentId = playerSvc.getCurrentId();
    mediaSvc.getMeta( $scope.currentTrack.url ).then(function(media) {
      $scope.currentTrack.media = media;
      $scope.playerState = true;
      $scope.playState = true;
    });
  });
  
  // while a track is playing we need to keep feeding the track progress info to the progress bar.
  $rootScope.$on('timelineUpdate', function() {
    $timeout(function() {
      $scope.timeline = playerSvc.getTimelineInfo();
    }, 1);
  });
  
  // plays a track by playlist key.
  $scope.playTrack = function(key) {
    // if we're not in the right playlist we need to update the player service before we can play the track... 
    if( $state.params.filter && playerSvc.getCurrentFilter() !== $state.params.filter ) {
      // TODO: this is pretty lol. you should optimise it at some point.
      socialSvc.getFeed( $state.params.filter ).then(function(currentPlaylist) {
        playerSvc.setPlaylist( currentPlaylist, $state.params.filter );
      });
      
    }
    
    // okay, now you can play it.
    playerSvc.playTrack(key);
  };
  
  $scope.playPrev = function($event) { 
    $event.preventDefault();
    playerSvc.playPrev();
  };
  
  $scope.playNext = function($event) { 
    $event.preventDefault();
    playerSvc.playNext();
  };
  
  // stops the current track and updates the player state
  $scope.togglePause = function($event) {
    $event.preventDefault();
    playerSvc.togglePause();
    $scope.playState = !$scope.playState;
    
    // commenting out to stop the current list from not being highlighted when you pause.
    //$scope.currentId = ( $scope.playState ) ? playerSvc.getCurrentId() : 0 ;
  };
  
  // track info modal.
  $scope.trackInfo = function($event, track, media) { 
    $event.preventDefault();
    
    $scope.modal = {
      track: track,
      media: media
    };
    
    ngDialog.open({
      templateUrl: '/ng/trackinfo.tpl.html',
      scope: $scope,
      className: 'ngdialog-theme-default ngdialog-theme-mixism',
      preCloseCallback: function() { }
    });
  };
  
}]);
