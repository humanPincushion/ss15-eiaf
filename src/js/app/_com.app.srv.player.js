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
      currentId = undefined,
      currentStream,
      trackTimeline = {};
  
  function init() {
    window.SC.initialize({
      client_id: '686201a1b89029bf9dd12f5159b269d6'
    });
    hasInit = true;
  };
  
  function formatTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    
    if( secs < 10 )
      secs = '0' + secs;
    
    var timeStr = mins + ':' + secs;
    if( hrs )
      timeStr = hrs + ':' + timeStr;

    return timeStr;
  }
  
  function playNextTrack() {
    var current = false,
        nextId = false;
    
    $.each(currentPlaylist, function(key) {
      if(current === true)
        nextId = key;
      if(key === currentId)
        current = true;
    });
    
    if(nextId)
      playTrack(nextId);
  }
  
  function playTrack(id) { 
    window.SC.streamStopAll();
    
    console.log( currentPlaylist, id );
    
    if( !hasInit )
      init();
    
    var trackPath = currentPlaylist[id].urls[0].replace( /https?:\/\/(www.)?soundcloud.com\/[^\/]+\//i, '' ),
        opts = {
          onload: function() {
            var duration = this.duration;
          },
          /*
          onresume: function() {
            console.log('resumed');
          },
          onstop: function() {
            console.log('stopped);
          },
          onpause: function() {
            console.log('paused');
          },
          */
          onfinish: function() {
            console.log('complete');
            playNextTrack();
            trackTimeline = {};
          },
          whileplaying: function() { 
            trackTimeline = {
              duration: formatTime(this.duration),
              position: formatTime(this.position),
              percentage: this.position / (this.duration / 100)
            };
            
            $rootScope.$broadcast('timelineUpdate', trackTimeline);
          }
        };

    
    window.SC.stream( '/tracks/' + trackPath, opts, function(sound) {
      sound.play();
      currentStream = sound;
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
    }, 
    togglePause: function() {
      currentStream.togglePause();
    },
    getTimelineInfo: function() {
      return trackTimeline;
    }
  };
}]);
