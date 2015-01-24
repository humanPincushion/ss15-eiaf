'use strict';
/**
 * @ngdoc service
 * @name app.service.mediaSvc
 * @function
 * 
 * @description
 * Factory to get media information from Soundcloud.
 *
 * @return {Object} Closure which returns promises to web service calls.
 */

app.factory('mediaSvc', ['$http', '$q', function($http, $q) { 
  
  function getMetadata( url ) { 
    var deferred = $q.defer(),
        params = {
          url: url,
          format: 'json'
        };
    
    $.ajax({
      url: 'http://soundcloud.com/oembed',
      data: params,
      success: function (data, textStatus, xhr ) { 
        var media = {
          artist: data.author_name,
          artistUrl: data.author_url,
          title: data.title,
          artwork: data.thumbnail_url,
          source: data.provider_name
        };
        //console.log( data );
        deferred.resolve(media);
      },
      error: function (textStatus, err, xhr) {
        deferred.reject( textStatus, err );
      }
    });
    
    return deferred.promise;
  }
  
  function getTrack(url) { 
    var deferred = $q.defer(),
        trackPath = url.replace( /https?:\/\/(www.)?soundcloud.com\/[^\/]+\//i, '' );
    
    console.log('init', url, trackPath);
    
    SC.initialize({
      client_id: '686201a1b89029bf9dd12f5159b269d6',
      redirect_uri: 'http://development.ss15-eiaf.divshot.io/sc_callback.html'
    });
    
    console.log('auth');

    SC.stream( '/tracks/'+trackPath, function(sound) {
      sound.play();
    });
    
    // initiate auth popup
    /*SC.get('/tracks', {
      q: trackPath,
      filter: 'all',
      order: 'hotness'
    }, function (results) {
      console.log( 'test', results );
      deferred.resolve( results );
      });*/
    
    return deferred.promise;
    
    // https://soundcloud.com/pegboardnerds/excision-pegboard-nerds-bring-the-madness
  }
  
  return { 
    getMeta: function(url) { 
      return getMetadata(url);
    },
    getMediaItem: function(url) {
      return getTrack(url);
    }
  };
}]);
