'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', '$timeout', '$rootScope', '$state', 'playerSvc', 'mediaSvc', 'socialSvc', 'ngDialog', '$sce', function($scope, $localStorage, $timeout, $rootScope, $state, playerSvc, mediaSvc, socialSvc, ngDialog, $sce) {
  
  $scope.playlist = [];
  $scope.currentPlaylist = [];
  $scope.title = false;
  $scope.currentTrack = [];
  $scope.currentPlaylistInfo = {};
  $scope.playerState = false; // should the player be visible?
  $scope.playState = false; // is it playing or paused?
  $scope.timeline = {};
  $scope.mainNavOpen = false;
  $scope.filterName = '#mixism';
  
  // used as the breadcrumb in the header search input.
  function updatePlaylistTitle(filter) { 
    if(filter === undefined) {
      return $scope.title = '';
    }
    
    $scope.title = filter;
  }
  
  // used for the backlink in the player to get back to the current playlist.
  function updatePlaylistInfo() { 
    var filter = $state.params.filter;
    
    if(filter === undefined || filter === '') {
      $scope.currentPlaylistInfo = {
        name: '#mixism',
        route: filter,
        current: playerSvc.getCurrentId(),
        total: Object.keys($scope.currentPlaylist).length
      };
      
      return false;
    }
    
    $scope.currentPlaylistInfo = {
      name: filter,
      route: filter,
      current: playerSvc.getCurrentId(),
      total: Object.keys($scope.currentPlaylist).length
    };
  }
  
  // init backlink.
  updatePlaylistInfo();
  
  // state params need to trigger a playlist update.
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) { 
    $('.ngdialog-content .btn-close').click();
    $rootScope.$broadcast('filterChange', toParams.filter);
    updatePlaylistTitle( toParams.filter );
  });
  
  // when a track is playing, update the player UI.
  $rootScope.$on('trackStarted', function() {
    $scope.playerState = true;
    $scope.currentTrack = playerSvc.getCurrentTrack();
    mediaSvc.getMeta( $scope.currentTrack.url ).then(function(media) {
      $scope.currentTrack.media = media;
      $scope.playState = true;
      updatePlaylistInfo();
    });
  });
  
  // sync track errors back into the playlist.
  $rootScope.$on('trackError', function() {
    $timeout(function() {
      $scope.currentPlaylist = playerSvc.getPlaylist();
    }, 1);
  });
  
  // while a track is playing we need to keep feeding the track progress info to the progress bar.
  $rootScope.$on('timelineUpdate', function() {
    $timeout(function() {
      $scope.timeline = playerSvc.getTimelineInfo();
    }, 1);
  });
  
  // plays a track by playlist key.
  $scope.playTrack = function(key) { 
    $scope.playerState = true;
    // if we're not in the right playlist we need to update the player service before we can play the track... 
    if( $state.params.filter && playerSvc.getCurrentFilter() !== $state.params.filter ) {
      // TODO: this is pretty lol. you should optimise it at some point.
      socialSvc.getFeed( $state.params.filter ).then(function(currentPlaylist) {
        playerSvc.setPlaylist( currentPlaylist, $state.params.filter );
        
        // okay, now you can play it.
        playerSvc.playTrack(key);
      });
      
    } else { 
      playerSvc.setPlaylist( $scope.currentPlaylist, $state.params.filter );
      playerSvc.playTrack(key);
    }
  };
  
  /**
    * player control buttons.
    */
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
  };
  
  // track info modal.
  $scope.trackInfo = function($event, track, media) { 
    $event.stopPropagation();
    
    $scope.modal = {
      track: track,
      media: media
    };
    
    $scope.modal.track.trustedHtmlText = $sce.trustAsHtml( $scope.modal.track.htmlText );

    ngDialog.open({
      templateUrl: '/ng/trackinfo.tpl.html',
      scope: $scope,
      className: 'ngdialog-theme-default ngdialog-theme-mixism',
      preCloseCallback: function() { }
    });
  };
  
  $(document).on('click', '.social-post a.playlist', function() {
    var filter = $(this).attr('playlist');
    $(this).closest('.ngdialog-content').find('.btn-close').click();
    $state.go('play.filter', {filter: filter});
    return false;
  });
  
}]);
