var register = function(Handlebars) {
  var helpers = {
    // put all helpers inside of this object with keys as names of helpers
    json: function(obj) {
      return JSON.stringify(obj);
    } 
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } 
  else return helpers;
};

module.exports.register = register;
module.exports.helpers = register(null);
