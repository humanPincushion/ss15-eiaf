
app.run(['$rootScope', function($rootScope) {  
  
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) { 
    $rootScope.rootClass = ( toState.name.indexOf('play') !== -1 ) ? 'view-player' : 'view-default';
  });
         
}]);
