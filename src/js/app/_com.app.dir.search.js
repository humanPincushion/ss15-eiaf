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

app.directive('mxSearch', ['$state', '$rootScope', function($state, $rootScope) {
  return {
    restrict: 'EA',
    templateUrl: '/ng/search.tpl.html',
    scope: {
      filter: '=ngModel'
    },
    controller: function($scope) { 
      
      // watch for filter changes, and at the default playlist use a custom filter name.
      $rootScope.$on('filterChange', function(filter) {
        if( $state.current.name === 'play') {
          $scope.filter = '#mixism';
        }
      });
      
      // hijack submission of search form.
      $scope.searchSubmit = function($event) {
        $event.preventDefault();
        var input = $scope.filter,
            filter,
            filterStr;
        
        if( !/^[@#]/.test( $scope.filter ) && $scope.filter.length > 0 )
          input = '#' + input;
        
        filter = input.match(/[@#][a-z0-9_]+/i);
        
        if( filter ) {
          filterStr = filter[0];
        }
        
        console.log( filterStr );
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
            $element.find('form').attr( 'title', $attributes.mxSearchVerb + ' by #hashtag or @username' );
            $element.find('input:text').attr( 'placeholder', $attributes.mxSearchVerb );
            $element.find('button span').text( $attributes.mxSearchVerb );
          }
        }
      }
    },
  };
}]);