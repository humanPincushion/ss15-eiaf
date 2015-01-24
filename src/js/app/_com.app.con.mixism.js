'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', 'socialSvc', function($scope, $localStorage, socialSvc) {
  // includes main audio player controls.
  
  $scope.filter = '';
  $localStorage.playlist = [];
  
  socialSvc.getFeed();
  
  socialSvc.getFeed().then(function(response) {
      $localStorage.playlist = response;
    
      console.log( response );
    });
}]);