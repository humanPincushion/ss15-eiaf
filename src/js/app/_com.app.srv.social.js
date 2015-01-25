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

app.factory('socialSvc', ['$http', '$q', function($http, $q) { 
  
  var cb = new Codebird(),
      bearer_token;
  cb.setConsumerKey('2lgZlNVdiiOWDxkwH1zhoiIwo', 'kROR3HP7J4azEkFyx2lJZ4gk1lhuxF2JFhPuF4I3XVTCkKZnq3');
  cb.__call(
    'oauth2_token',
    {},
    function (reply) {
      bearer_token = reply.access_token;
    }
  );
  
  // organise the raw data from twitter for use as a mixism playlist.
  function organiseTweets(tweets) {
    var playlist = {},
        urls = [];
    
    $.each(tweets.reverse(), function(key, tweet) {
      var tweetObj = {},
          invalid = false;
      
      // discard tweets which don't contain urls.
      if( tweet.entities && tweet.entities.urls.length > 0 ) {
        // add basic tweet information.
        tweetObj = {
          'text': tweet.text,
          'hashtags': tweet.entities.hashtags,
          'url': '',
          'favourites': tweet.entities.favourite_count,
          'created': new Date(tweet.created_at),
          'user': {
            'name': tweet.user.name,
            'handle': tweet.user.screen_name,
            'avatar': tweet.user.profile_image_url
          },
          'key': tweet.id
        };
        
        console.log(tweet);
        
        // store all the urls the tweet contains.
        $.each(tweet.entities.urls, function(key, url) { 
          var allowedDomains = ['soundcloud.com'],
            search = url.expanded_url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i),
            domain = search && search[1];
          
          // url must be based on soundcloud track.
          if( $.inArray( domain, allowedDomains ) !== -1 ) {
            // ignore duplicates
            if( $.inArray( url.expanded_url, urls ) !== -1 )
              invalid = true;
            
            urls.push( url.expanded_url );
            tweetObj.url = url.expanded_url;
          }
        });
        
        // only add it if the tweet doesn't contain a duplicate url.
        if( !invalid && tweetObj.url !== '' )
          playlist[tweet.id] = tweetObj;
      }
    });
    
    return playlist;
  }
  
  // retrieve data from web service.
  function fetch(filter) {
    
    var deferred = $q.defer(),      // init promise.
        params = {
          q: '"#mixism"',
          result_type: 'recent',
          count: 50
        };
    
    if( filter !== undefined )
      params.q += ' AND ' + filter;
    
    // request results from webservice.
    cb.__call(
      'search_tweets',
      params,
      function (response) { 
        var filteredData = organiseTweets(response.statuses);
        deferred.resolve(filteredData);
      }
    );
    
    return deferred.promise;
  }
  
  return { 
    getFeed: function(filter) { 
      return fetch(filter);
    }
  };
}]);