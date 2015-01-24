'use strict';

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

  // routing
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/ng/home.tpl.html'
    })
    .state('play', {
      url: '/play',
      controller: 'PlaylistCtrl',
      templateUrl: '/ng/playlist.tpl.html'
    })
    .state('play.filter', {
      url: '/:filter',
      controller: 'PlaylistCtrl',
      templateUrl: '/ng/playlist.tpl.html'
    })
    .state('stuff', {
      url: '/stuff',
      controller: 'PlaylistCtrl',
      templateUrl: '/ng/stuff.tpl.html'
    });

  $urlRouterProvider.when('/home', '/');
  $urlRouterProvider.otherwise('/');

  $locationProvider
    .html5Mode(true)
    .hashPrefix('!');

}]);
