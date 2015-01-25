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
          author: data.author_name,
          authorUrl: data.author_url,
          title: data.title,
          artwork: data.thumbnail_url,
          source: data.provider_name,
          url: url
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
