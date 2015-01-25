// checks if a object is empty.
app.filter('empty', function() {
  return function(object) {
    return (object && Object.keys(object).length < 1);
  };
});