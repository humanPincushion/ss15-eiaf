'use strict';

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider' , function($stateProvider, $urlRouterProvider, $locationProvider) {

  // routing
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/ng/home.tpl.html'
    })
    .state('play', { 
      url: '/play',
      templateUrl: '/ng/playlist.tpl.html'
    })
    .state('play.filter', {
      url: '/:filter',
      templateUrl: '/ng/playlist.tpl.html'
    });

  $urlRouterProvider.when('/home', '/');
  $urlRouterProvider.otherwise('/');

  $locationProvider
    .html5Mode(true)
    .hashPrefix('!');
  
}]);
