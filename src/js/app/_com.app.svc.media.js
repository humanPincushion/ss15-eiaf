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
          name: data.title,
          artwork: data.thumbnail_url,
          source: data.provider_name
        };
        deferred.resolve(media);
      },
      error: function (textStatus, err, xhr) {
        deferred.reject( textStatus, err );
      }
    });
    
    return deferred.promise;
  }
  
  return { 
    getMeta: function(url) { 
      return getMetadata(url);
    }
  };
}]);