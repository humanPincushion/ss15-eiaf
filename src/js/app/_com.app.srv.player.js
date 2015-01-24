'use strict';
/**
 * @ngdoc service
 * @name app.service.playerSvc
 * @function
 * 
 * @description
 * The media player.
 *
 * @return {Object} Audio player service.
 */

app.factory('playerSvc', ['$rootScope', function($rootScope) { 
  
  var hasInit = false,
      currentPlaylist = [],
      currentId = undefined;
  
  function init() {
    window.SC.initialize({
      client_id: '686201a1b89029bf9dd12f5159b269d6'
    });
    hasInit = true;
  };
  
  function playTrack(id) { 
    
    window.SC.streamStopAll();
    
    if( !hasInit )
      init();
    
    console.log('playing track '+id);
    
    var trackPath = currentPlaylist[id].urls[0].replace( /https?:\/\/(www.)?soundcloud.com\/[^\/]+\//i, '' );

    window.SC.stream( '/tracks/' + trackPath, function(sound) {
      sound.play();
      currentId = id;
      $rootScope.$broadcast('trackStarted', id);
    });
    
    // https://soundcloud.com/pegboardnerds/excision-pegboard-nerds-bring-the-madness
  }
  
  return { 
    getPlaylist: function() {
      return currentPlaylist;
    },
    setPlaylist: function(playlist) {
      currentPlaylist = playlist;
      return this.playFirstTrack(); // return key of currently playing track.
    }, 
    getCurrentTrack: function() {
      return currentPlaylist[currentId];
    },
    playFirstTrack: function() {
      return this.playTrack( Object.keys(currentPlaylist)[0] );
    },
    playTrack: function(id) { 
      return playTrack(id);
    }
  };
}]);
