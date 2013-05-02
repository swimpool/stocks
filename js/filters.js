angular.module('widget.filters', [])

  .filter('formatValue', function () {
    return function (input) {
      return input ? input.toFixed(2) : '';
    };
  });