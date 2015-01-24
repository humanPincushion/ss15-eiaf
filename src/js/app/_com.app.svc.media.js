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
  
  function getMetadata() {
    
  }
  
  return { 
    getMeta: function(url) { 
      return getMetadata(url);
    }
  };
}]);