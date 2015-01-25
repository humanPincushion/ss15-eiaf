// returns an objects length
app.filter('objlen', function() {
  return function(object) { 
    var length = false;
    
    if(object) 
      length = (Object.keys(object).length < 1) ? false : Object.keys(object).length;
    
    return length;
  };
});