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
    var deferred = $q.defer();
    
    console.log('init');
    
    SC.initialize({
      client_id: '686201a1b89029bf9dd12f5159b269d6',
      redirect_uri: '3ef092963351533db7810da79c50e804'
    });

    // initiate auth popup
    SC.connect(function(url) {
      SC.get('/tracks', {
        q: url,
        filter: 'all',
        order: 'hotness'
      }, function (results) {
        console.log( 'test', results );
        deferred.resolve( results );
      });
    });
    
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
