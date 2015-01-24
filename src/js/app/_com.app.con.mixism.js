'use strict';

/**
 * @ngdoc function
 * @name app.controller:MixismCtrl
 * @description
 * # MixismCtrl
 * Root controller of the app
 */

app.controller('MixismCtrl', ['$scope', '$localStorage', function($scope, $localStorage) {
  // includes main audio player controls.
  
  $scope.filter = '';
  $localStorage.playlist = [];
}]);