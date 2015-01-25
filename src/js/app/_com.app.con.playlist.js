'use strict';

/**
 * @ngdoc function
 * @name app.controller:PlaylistCtrl
 * @description
 * # PlaylistCtrl
 * Handles playlist navigation and deeper views.
 */

app.controller('PlaylistCtrl', ['$scope', 'socialSvc', 'playerSvc', '$state', '$rootScope', '$localStorage', function($scope, socialSvc, playerSvc, $state, $rootScope, $localStorage) {
  
  $scope.loading = true;
  $localStorage.playlist = [];
  
  // fetch new playlist and update player service.
  function updatePlaylist(filter) {
    $scope.loading = true;
    
    console.log( $scope.$parent );
    
    $scope.$parent.currentPlaylist = $localStorage.playlist[ filter ];
    socialSvc.getFeed(filter).then(function(currentPlaylist) {
      $scope.$parent.playlist[ filter ] = currentPlaylist;
      
      // TODO: only change playlist when a track is played from outside of the current playlist.
      $scope.$parent.currentPlaylist = currentPlaylist;
      playerSvc.setPlaylist( currentPlaylist );
      $localStorage.playlist = $scope.playlist;
      $scope.loading = false;
    });
  }
  
  $rootScope.$on('filterChange', function(filter) {
    if( $state.current.name.indexOf('play') !== -1 )
      updatePlaylist( $state.params.filter );
  });
  
  updatePlaylist( $state.params.filter );
  
}]);