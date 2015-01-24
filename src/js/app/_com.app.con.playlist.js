'use strict';

/**
 * @ngdoc function
 * @name app.controller:PlaylistCtrl
 * @description
 * # PlaylistCtrl
 * Handles playlist navigation and deeper views.
 */

app.controller('PlaylistCtrl', ['$scope', 'socialSvc', '$state', '$stateParams', '$rootScope', '$localStorage', function($scope, socialSvc, $state, $stateParams, $rootScope, $localStorage) {
  
  $scope.loading = true;
  
  function updatePlaylist(filter) {
    $scope.loading = true;
    $scope.$parent.currentPlaylist = $localStorage.playlist[ filter ];
    socialSvc.getFeed(filter).then(function(response) {
      $scope.$parent.playlist[ filter ] = response;
      $scope.$parent.currentPlaylist = response;
      $localStorage.playlist = $scope.playlist;
      $scope.loading = false;
    });
  }
  
  $rootScope.$on('filterChange', function(filter) {
    updatePlaylist( $state.params.filter );
  });
  
  updatePlaylist( $state.params.filter );
  
}]);