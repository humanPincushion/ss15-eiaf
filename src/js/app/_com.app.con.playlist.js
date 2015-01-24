'use strict';

/**
 * @ngdoc function
 * @name app.controller:PlaylistCtrl
 * @description
 * # PlaylistCtrl
 * Handles playlist navigation and deeper views.
 */

app.controller('PlaylistCtrl', ['$scope', 'socialSvc', '$state', '$stateParams', '$rootScope', function($scope, socialSvc, $state, $stateParams, $rootScope) {
  
  //console.log( $state.params.filter );
  
  function updatePlaylist(filter) {
    socialSvc.getFeed(filter).then(function(response) {
      $scope.$parent.playlist = response;
    });
  }
  
  $rootScope.$on('filterChange', function(filter) {
    updatePlaylist( $state.params.filter );
  });
  
  updatePlaylist( $state.params.filter );
  
}]);