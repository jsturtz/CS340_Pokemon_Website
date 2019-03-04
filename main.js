// // // for file writing
const fs = require('fs');

// import express, setup express object named "app"
var mysql = require('./dbcon.js');
var tools = require('./tools');
var express = require('express');
var app = express();
      
// import handlebars and bodyParser
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('port', 3291);
app.set('view engine', 'handlebars');

// tells app to either use urlencoded or json depending on what it parses
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// makes "public" the location to serve static files (images, css, html)
app.use(express.static('public', { extensions: ['html'] }));

// read is the home page
app.get('/',function(req,res){
  res.render('index');
});

app.get('/create',function(req,res){
  getPageInfo(function(context) {
    res.render('create', context);
  })
});

app.get('/read',function(req,res){
  getPageInfo(function(info) {
    res.render('read', info);
  });
});

app.post('/create', function(req, res) {
  // response object will be sent with status code of either 
  // 200 (OK) or 422(Unprocessable Entity) if user enters bad
  // data
  switch(req.body.action) {
    case "type": 
      addType(req.body.name, function(code, message) {
        res.status(code).send(message);
      }); 
      break; 

    case "type-relation":

      addTypeRelation(
        req.body.weak, 
        req.body.strong, 
        function(code, message) {
          res.status(code).send(message); 
        });
      break;

    case "move":
      addMove(
        req.body.name, 
        req.body.effect, 
        function(code, message) {
          res.status(code).send(message); 
        });
      break;

    case "location":
      addLocation(
        req.body.name, 
        req.body.description, 
        function(code, message) {
          res.status(code).send(message); 
        });
      break;

    default:
      res.send("ERROR: Incorrect format for post");
      break;
  }
});

app.get('/update',function(req,res){
  res.render('update');
});

app.get('/delete',function(req,res){
  res.render('delete');
});

function addType(name, callback) {
  // get names to ensure 'name' not already in database
  mysql.pool.query(
    "SELECT name FROM Types;", 
    function(err, rows, fields) {
    if (err) return callback(422, err);

    for (var i = 0; i < rows.length; i++) {
      if (name == rows[i].name) return callback(422, "Name already exists");
    }
    
    // insert into database
    mysql.pool.query(
      'INSERT INTO Types (name) VALUES ("' + name + '")', 
      function(err, rows, fields) {
      if (err) return callback(422, err);
      return callback(200, "Type added successfully!");
    });
  });
}

function addTypeRelation(weak, strong, callback) {
  
  if (weak === strong) return callback(422, "A type cannot be weak or strong against itself");
  
  // get weak_id
  mysql.pool.query(
    'SELECT id FROM Types WHERE name = "' + weak + '";', 
    function(err, rows, fields) {
    if (err) return callback(422, err);
    var weak_id = rows[0].id; 
    
    // get strong_id
    mysql.pool.query(
      'SELECT id FROM Types WHERE name = "' + strong + '";', 
      function(err, rows, fields) {
      if (err) return callback(422, err);
      var strong_id = rows[0].id;
    
      // used to verify that this combo hasn't been added in either direction
      mysql.pool.query(
        'SELECT weak_id, strong_id FROM Types_Strength WHERE (weak_id = "' + weak_id + 
        '" AND strong_id = "' + strong_id + '") OR (weak_id = "' + strong_id + 
        '" AND strong_id = "' + weak_id + '");', 
        function(err, rows, fields) {
        if (err) return callback(422, err);
        if (rows.length > 0) return callback(422, "That relation already exists in the database");
        
        // insert into database
        mysql.pool.query(
          'INSERT INTO Types_Strength (weak_id, strong_id) ' +
          'VALUES("' + weak_id + '", "' + strong_id + '");', 
          function(err, rows, fields) {
          if (err) return callback(422, "This relation is already in the database");
          callback(200, "Type Relation successfully added"); // success!
        });
      });
    });
  });
}

// precondition: name and effect must be cleaned up (no extra whitespace on
// either end, every first digit is always upper case) 
// database must have no bad entries

function addMove(name, effect, callback) {
  // make sure name isn't already in Moves
  mysql.pool.query(
    "SELECT name FROM Moves;", 
    function(err, rows, fields) {
    if (err) return callback(422, err);
    
    console.log(name);
    for (var i = 0; i < rows.length; i++) {
      if (name == rows[i].name) {
        return callback(422, "That move already exists in the database");
      }
    }

    // insert into moves   
    mysql.pool.query(
      'INSERT INTO Moves (name, status_effect) ' + 
      'VALUES ("' + name + '", "' + effect + '")', 
      function(err, rows, fields) {
      if (err) return callback(422, err);
      return callback(200, "Move successfully added");
    });
  });
}
// precondition: name must be cleaned up, i.e. only the first character
// of every word in name is upper case. Must also be true of elements
// in database

function addLocation(name, desc, callback) {
  // make sure name isn't already in Locations
  mysql.pool.query(
    "SELECT name FROM Locations;", 
    function(err, rows, fields) {
    if (err) return callback(422, err);
    
    for (var i = 0; i < rows.length; i++) {
      if (name == rows[i].name) {
        return callback(422, "That location already exists in the database");
      }
    }

    // insert into moves   
    mysql.pool.query(
      'INSERT INTO Locations (name, description) ' + 
      'VALUES ("' + name + '", "' + desc + '")', 
      function(err, rows, fields) {
      if (err) return callback(422, err);
      return callback(200, "Location successfully added");
    });
  });
}

function getPageInfo(callback) {
  // builds sortString to add to mysql query. 
  
  var getIds = 'SELECT P.id FROM Pokemon P;';
  var getMoves = 
    'SELECT p.id, m.name, pm.move_level AS level FROM Moves m ' + 
    'INNER JOIN Pokemon_Moves pm ON m.id=pm.move_id ' +
    'INNER JOIN Pokemon p ON pm.poke_id = p.id;';
  var getPokeInfo = 
    'SELECT p.id, p.name, p.attack, p.defense, p.health, ' + 
    'p.speed, p.description FROM Pokemon p';
  var getTypes = 
    'SELECT P.id, T.name AS type FROM Pokemon P ' + 
    'INNER JOIN Pokemon_Types PT on PT.poke_id=P.id ' +
    'INNER JOIN Types T on T.id=PT.type_id;'
  var getLocations = 
    'SELECT p.id, l.name FROM Locations l ' + 
    'INNER JOIN Pokemon_Locations pl ON l.id = pl.location_id ' + 
    'INNER JOIN Pokemon p ON pl.poke_id = p.id;';
  var getToEvolutions = 
    'SELECT DISTINCT p.id, t.name ' +
    'From Pokemon p ' +
    'INNER JOIN Pokemon t ' +
    'INNER JOIN Evolutions e ON e.from_poke=t.id AND p.id=e.to_poke;';
  var getFromEvolutions = 
    'SELECT DISTINCT p.id, f.name ' + 
    'From Pokemon p ' + 
    'INNER JOIN Pokemon f ' + 
    'INNER JOIN Evolutions e ON e.to_poke=f.id AND p.id=from_poke;';
  
  var typeStrength = 
    'SELECT T.name, w.name AS "weak_against", s.name AS "strong_against" FROM Types T ' +
    'LEFT JOIN ( ' +
    'SELECT strong_id AS id, weak_id AS "strong_against" FROM Types_Strength ' +
    ') AS T1 ON T1.id = T.id ' +
    'LEFT JOIN Types s ON T1.strong_against=s.id ' +
    'LEFT JOIN ( ' +
    'SELECT weak_id AS id, strong_id AS "weak_against" FROM Types_Strength ' +
    ') AS T2 on T2.id = T.id ' +
    'LEFT JOIN Types w ON T2.weak_against=w.id;';

  var locationInfo = "SELECT name, description FROM Locations;"

  mysql.pool.query(getIds, function(err, rows, fields) {
    if (err) throw "ERROR: " + err 
    var ids = rows

    mysql.pool.query(getPokeInfo, function(err, rows, fields) {
      if (err) throw "ERROR: " + err 
      var pokeInfo = rows

      mysql.pool.query(getTypes, function(err, rows, fields) {
        if (err) throw "ERROR: " + err 
        var types = rows

        mysql.pool.query(getMoves, function(err, rows, fields) {
          if (err) throw "ERROR: " + err 
          var moves = rows

          mysql.pool.query(getLocations, function(err, rows, fields) {
            if (err) throw "ERROR: " + err 
            var locations = rows

            mysql.pool.query(getToEvolutions, function(err, rows, fields) {
              if (err) throw "ERROR: " + err 
              var evoTo = rows

              mysql.pool.query(getFromEvolutions, function(err, rows, fields) {
                if (err) throw "ERROR: " + err 
                var evoFrom = rows

                mysql.pool.query(typeStrength, function(err, rows, fields) {
                  if (err) throw "ERROR: " + err 
                  var typeStrength = rows

                  mysql.pool.query(locationInfo, function(err, rows, fields) {
                    if (err) throw "ERROR: " + err 
                    var locationInfo = rows
                  
                    // create pokemon list along with moveSet
                    var pokemon = [];
                    var moveSet = new Set();

                    for (var i = 0; i < ids.length; i++) {
                      for (var j = 0; j < pokeInfo.length; j++) {
                        if (pokeInfo[j].id == ids[i].id) {
                          var newPoke = {
                            id: ids[i].id,
                            name: pokeInfo[j].name, 
                            attack: pokeInfo[j].attack,
                            defense: pokeInfo[j].defense,
                            health: pokeInfo[j].health,
                            speed: pokeInfo[j].speed,
                            description: pokeInfo[j].description,
                            evolvesFrom: null, 
                            evolvesTo: null,
                            types: [], 
                            moves: [], 
                            locations: [], 
                          }
                        }
                      }

                      for (var j = 0; j < types.length; j++) {
                        if (types[j].id == ids[i].id) {
                          newPoke.types.push(types[j].type);
                        }
                      }

                      for (var j = 0; j < moves.length; j++) {
                        if (moves[j].id == ids[i].id) {
                          var newMove = {name: moves[j].name};
                          if (moves[j].level === null) newMove.level = "Innate";
                          else newMove.level = moves[j].level;
                          newPoke.moves.push(newMove);
                          moveSet.add(moves[j].name);
                        }
                      }

                      for (var j = 0; j < locations.length; j++) {
                        if (locations[j].id == ids[i].id) {
                          newPoke.locations.push(locations[j].name);
                        }
                      }
                      for (var j = 0; j < evoFrom.length; j++) {
                        if (evoFrom[j].id == ids[i].id) {
                          newPoke.evolves_from = evoFrom[j].name;
                        }
                      }
                      for (var j = 0; j < evoTo.length; j++) {
                        if (evoTo[j].id == ids[i].id) {
                          newPoke.evolves_to = evoTo[j].name;
                        }
                      }
                      pokemon.push(newPoke);
                    }
                    
                    var typeList = [];

                    // create type list based on weak/strong
                    for (var j = 0; j < typeStrength.length; j++) {
                      typeList.push({ 
                        name: typeStrength[j].name, 
                        weak_against: typeStrength[j].weak_against, 
                        strong_against: typeStrength[j].strong_against
                      });
                    }

                    // create location list
                    var locationList = [];
                    for (var j = 0; j < locationInfo.length; j++) {
                      locationList.push({ 
                        name: locationInfo[j].name, 
                        description: locationInfo[j].description 
                      });
                    }

                    var context = { 
                      pokemon: pokemon, 
                      types: typeList,
                      moves: Array.from(moveSet), 
                      locations: locationList
                    }

                    callback(context);

                  }); 
                }); 
              }); 
            }); 
          }); 
        }); 
      }); 
    }); 
  }); 
}

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
