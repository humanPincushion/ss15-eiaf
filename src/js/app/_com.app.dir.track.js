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
    controller: function($scope) {
      $scope.oembedComplete = false;
    },
    link: function($scope, $element) {

      var allowedDomains = ['soundcloud.com'],
          search = $scope.track.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i),
          domain = search && search[1];

      // use the media service to lookup metadata based on soundcloud url.
      if( $.inArray( domain, allowedDomains ) !== -1 ) {
        mediaSvc.getMeta( $scope.track.url ).then(function(media) {
          $scope.media = media;
          $scope.oembedComplete = true;
        });
      } else {
        $scope.media = false;
      }

    }
  };
}]);