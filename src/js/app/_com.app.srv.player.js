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
      currentFilter,
      currentPlaylist = {},
      currentId,
      currentIndex = null,
      currentStream,
      trackTimeline = {};
  
  function init() {
    window.SC.initialize({
      client_id: '686201a1b89029bf9dd12f5159b269d6'
    });
    hasInit = true;
  }
  
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
  
  function findIndex(key) {
    var index = 0;
    $.each(currentPlaylist, function(id) {
      if( id === key )
        return false;
      
      index++;
    });
    
    return index;
  }
  
  function playPrevTrack() {
    var prevId = false;
    
    $.each(currentPlaylist, function(key) {
      if(key === currentId)
        return false;
      
      prevId = key;
    });
    
    if(prevId)
      playTrack(prevId);
  }
  
  function playNextTrack() {
    var current = false,
        nextId = false;
    
    $.each(currentPlaylist, function(key) {
      if(current === true) {
        nextId = key;
        return false;
      }
      
      if(key === currentId)
        current = true;
    });
    
    if(nextId)
      playTrack(nextId);
  }
  
  function playTrack(id) { 
    window.SC.streamStopAll();
    
    if( !hasInit )
      init();
    
    var trackPath = currentPlaylist[id].url.replace( /https?:\/\/(www.)?soundcloud.com\/[^\/]+\//i, '' ),
        index = findIndex(id),
        opts = {
          onload: function() {
            var duration = this.duration;
            //console.log(this);
            
            // 0 = uninitialised
            // 1 = loading
            // 2 = failed/error
            // 3 = loaded/success
            if (this.readyState == 2) {
              currentPlaylist[id].error = true;
              $rootScope.$broadcast('trackError', true);
            }
          },
          onfinish: function() { 
            playNextTrack();
            trackTimeline = {};
          },
          whileplaying: function() { 
            trackTimeline = { 
              init: true,
              position: formatTime(this.position),
              percentage: this.position / (this.duration / 100),
              buffering: !(this.bytesLoaded >= this.bytesTotal), //this.isBuffering, <-- this sucks.
              completed: (this.bytesLoaded >= this.bytesTotal),
              index: index
            };
            
            if( trackTimeline.completed )
              trackTimeline.duration = formatTime(this.duration)
            
            $rootScope.$broadcast('timelineUpdate', trackTimeline);
          }
        };

    
    window.SC.stream( '/tracks/' + trackPath, opts, function(sound) {
      sound.play();
      currentStream = sound;
      currentId = id;
      $rootScope.$broadcast('trackStarted', id);
    });
  }
  
  function playFirstTrack() {
    return playTrack( Object.keys(currentPlaylist)[0] );
  }
  
  return { 
    getPlaylist: function() {
      return currentPlaylist;
    },
    setPlaylist: function(playlist, filter) {
      currentPlaylist = playlist;
      currentFilter = filter;
    }, 
    getCurrentFilter: function() {
      return currentFilter;
    },
    getCurrentId: function() {
      return currentId;
    },
    getCurrentTrack: function() {
      return currentPlaylist[currentId];
    }, 
    playFirstTrack: function(id) { 
      return playFirstTrack(); // return key of currently playing track.
    },
    playTrack: function(id) { 
      return playTrack(id);
    }, 
    playPrev: function() {
      playPrevTrack();
    }, 
    playNext: function() {
      playNextTrack();
    }, 
    togglePause: function() {
      currentStream.togglePause();
    },
    getTimelineInfo: function() {
      return trackTimeline;
    }
  };
}]);
