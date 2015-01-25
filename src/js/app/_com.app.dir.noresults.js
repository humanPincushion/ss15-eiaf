'use strict';

/**
 * @ngdoc directive
 * @name app.directive.mxNoResults
 * @function
 *
 * @description
 * Recyclable partial for when no search results are available.
 *
 * @return {Object} Configuration object for the directive.
 */

app.directive('mxNoResults', [function() {
  return {
    restrict: 'EA',
    templateUrl: '/ng/no-results.tpl.html'
  };
}]);