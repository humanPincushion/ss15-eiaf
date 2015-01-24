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

app.factory('playerSvc', [function() { 
  
  var hasInit = false;
  
  function init() {
    

    window.SC.initialize({
      client_id: '686201a1b89029bf9dd12f5159b269d6',
      redirect_uri: 'http://development.ss15-eiaf.divshot.io/sc_callback.html'
    });
    hasInit = true;
  };
  
  function switchToTrack(url) { 
    
    window.SC.streamStopAll();
    
    if( !hasInit )
      init();
    
    var trackPath = url.replace( /https?:\/\/(www.)?soundcloud.com\/[^\/]+\//i, '' );

    window.SC.stream( '/tracks/' + trackPath, function(track) {
      track.play();
    });
    
    // https://soundcloud.com/pegboardnerds/excision-pegboard-nerds-bring-the-madness
  }
  
  return { 
    playTrack: function(url) { 
      return switchToTrack(url);
    }
  };
}]);
