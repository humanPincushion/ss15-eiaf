'use strict';

/**
 * @ngdoc directive
 * @name app.directive.mxTrack
 * @function
 * 
 * @description
 * Populates media meta data into a track within the playlist.
 *
 * @param {Element} $window AngularJS wrapper for document.window
 * @param {Factory} $timeout AngularJS wrapper for setTimeout()
 *
 * @return {Object} Configuration object for the directive.
 */

app.directive('mxTrack', ['mediaSvc', 'playerSvc', function(mediaSvc, playerSvc) {
  return {
    restrict: 'EA',
    templateUrl: '/ng/track.tpl.html',
    link: function($scope, $element) { 
      
      var allowedDomains = ['soundcloud.com'],
          search = $scope.track.urls[0].match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i),
          domain = search && search[1];
      
      //console.log( $.inArray( domain, allowedDomains ) );
      
      if( $.inArray( domain, allowedDomains ) !== -1 ) { 
        //console.log( $scope.track.urls[0] );
        mediaSvc.getMeta( $scope.track.urls[0] ).then(function(media) { 
          $scope.media = media;
          //console.log('media');
          playerSvc.playTrack( $scope.track.urls[0] );
          
        });
      } else {
        $scope.media = false;
      }
      
      
    }
  };
}]);