
app.run(['$rootScope', function($rootScope) {

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
    $rootScope.isPlayer = ( toState.name.indexOf('play') !== -1 ) ? true : false;
  });

}]);
