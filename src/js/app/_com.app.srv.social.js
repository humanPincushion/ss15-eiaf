'use strict';
/**
 * @ngdoc service
 * @name app.service.socialSvc
 * @function
 * 
 * @description
 * Factory to fetch data from social media channels.
 *
 * @return {Object} Closure which returns promises to web service calls.
 */

app.factory('socialSvc', ['$http', '$q', '$resource', function($http, $q, $resource) { 
  
  var cb = new Codebird;
  cb.setConsumerKey('2lgZlNVdiiOWDxkwH1zhoiIwo', 'kROR3HP7J4azEkFyx2lJZ4gk1lhuxF2JFhPuF4I3XVTCkKZnq3');
  cb.__call(
    'oauth2_token',
    {},
    function (reply) {
      var bearer_token = reply.access_token;
    }
  );
  
  var cache = {};
  
  // Retrieve data from web service.
  function fetch(filter, username) {
    
    var deferred = $q.defer(),      // init promise.
        params = {q: '#mixism'};    // setup parameters.
    
    // request results from webservice.
    cb.__call(
      'search_tweets',
      params,
      function (response) {
        deferred.resolve(response);
      }
    );
    
    return deferred.promise;
  }
  
  
  return { 
    getFeed: function(fund) { 
      return fetch(null, null);
    }
  };
}]);