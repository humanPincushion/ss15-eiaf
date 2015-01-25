'use strict';

/**
 * @ngdoc directive
 * @name app.directive.mxSearch
 * @function
 *
 * @description
 * Search form to find new playlists to listen to.
 *
 * @return {Object} Configuration object for the directive.
 */

app.directive('mxSearch', ['$state', function($state) {
  return {
    restrict: 'EA',
    templateUrl: '/ng/search.tpl.html',
    scope: {
      filter: '=ngModel'
    },
    controller: function($scope) { 
      
      // hijack submission of search form.
      $scope.searchSubmit = function($event) {
        $event.preventDefault();
        var input = $scope.filter,
            filter,
            filterStr;
        
        if( !/^[@#]/.test( $scope.filter ) && $scope.filter.length > 0 )
          input = '#' + input;
        
        filter = input.match(/[@#][a-z0-9_]+/i);
        
        if( filter ) 
          filterStr = filter[0]; 
        
        $state.go('play.filter', {filter: filterStr});
        return;
      };
      
    },
    compile: function compile($element, $attributes, transclude) {
      return {
        pre: function preLink() {},
        post: function postLink($scope, $element, $attributes) {
          if( $attributes.mxSearchClass )
            $element.find('form').addClass( 'form-' + $attributes.mxSearchClass );
          
          if( $attributes.mxSearchVerb ) { 
            $element.find('form').attr( 'title', $attributes.mxSearchVerb + ' by #hashtag' );
            $element.find('input:text').attr( 'placeholder', $attributes.mxSearchVerb );
            $element.find('button span').text( $attributes.mxSearchVerb );
          }
        }
      }
    },
  };
}]);