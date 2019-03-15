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
app.set('port', 23391);
app.set('view engine', 'handlebars');

// tells app to either use urlencoded or json depending on what it parses
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// makes "public" the location to serve static files (images, css, html)
app.use(express.static('public', { extensions: ['html'] }));

// read is the home page
app.get('/',function(req,res){
  var context = {title: "Index", title_description: "Welcome to the Pokedex!"}
  res.render('index', context);
});

app.get('/create',function(req,res){
  getPageInfo(req.query.col, req.query.sortBy, function(context) {
    context.title = "Create";
    context.title_description = "Add Something to the Database";
    res.render('create', context);
  });
});

app.get('/read',function(req,res){
  getPageInfo(req.query.col, req.query.sortBy, function(context) {
    context.title = "Read";
    context.title_description = "See the Contents of the Database";
    context.sortCol = req.query.col;
    context.sortBy = req.query.sortBy;
    console.log(context);
    res.render('read', context);
  });
});

app.get('/update',function(req,res){
  getPageInfo(req.query.col, req.query.sortBy, function(context) {
    context.title = "Update";
    context.title_description = "Update Entities in the Database";
    console.log(context);
    res.render('update', context);
  });
});

app.get('/delete',function(req,res){
  getPageInfo(req.query.col, req.query.sortBy, function(context) {
    context.title = "Delete";
    context.title_description = "Delete Entities in the Database";
    res.render('delete', context);
  });
});

app.post('/update', function(req, res) {
  switch(req.body.action) {
    case "pokemon":
      updatePoke(
        req.body.id,
        req.body.name, 
        req.body.health,
        req.body.attack,
        req.body.defense,
        req.body.speed,
        function(code, message) {
        res.status(code).send(message); 
      });
      break;

    case "type":
      updateType(req.body.id, req.body.name, function(code, message) {
        res.status(code).send(message);
      });
      break;

    case "move":
      updateMove(req.body.id, req.body.name, req.body.status_effect, function(code, message) {
        res.status(code).send(message);
      });
      break;

    case "location":
      updateLocation(req.body.id, req.body.name, req.body.description, function(code, message) {
        res.status(code).send(message);
      });
      break;

    default:
      res.send("ERROR: Incorrect format for post");
      break;
  }
});

app.post('/delete', function(req, res) {
  // response object will be sent with status code of either 
  // 200 (OK) or 422(Unprocessable Entity) if user enters bad
  // data
  switch(req.body.action) {
    case "delete_Poke":
      delete_Poke(req.body.name, function(code, message) {
        res.status(code).send(message); 
      });
      break;

    case "delete_Type":
      delete_Type(req.body.name, function(code, message) {
        res.status(code).send(message);
      });
      break;

    case "delete_Move":
      delete_Move(req.body.name, function(code, message) {
        res.status(code).send(message);
      });
      break;

    case "delete_Location":
      delete_Location(req.body.name, function(code, message) {
        res.status(code).send(message);
      });
      break;


    default:
      res.send("ERROR: Incorrect format for post");
      break;
  }
});

app.post('/create', function(req, res) {
  // response object will be sent with status code of either 
  // 200 (OK) or 422(Unprocessable Entity) if user enters bad
  // data
  switch(req.body.action) {
    case "pokemon":
      addPokemon(req.body, function(code, message) {
        console.log(message);
        res.status(code).send(message); 
      });
      break;

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

function updatePoke(id, name, health, attack, defense, speed, callback) {
  if ((name == "") || (health == "") || (attack =="") || (defense =="") || (speed ==""))
  return callback(200, "Please fill out all values!");
  console.log("health: " + health);

  if ((health < 0) || (attack < 0) || (defense < 0) || (speed < 0))
  return callback(200, "Please enter positve values for stats");

  mysql.pool.query(
  'UPDATE Pokemon SET name= "' + name + '" , health= "' + health + '" , attack = ' + attack +
  ', defense = ' + defense + ', speed = ' + speed + ' WHERE id = ' + id + ';',
  function(err, rows, fields) {
    if (err) return callback(422, err);
    return callback(200, "Pokemon Updated successfully!");
  });
}

function updateType(id, name, callback) {
    if (name == "") return callback(200, "Please select a Type!");

    mysql.pool.query(
    'UPDATE Types SET name= "' + name + '" WHERE id = ' + id + ';',
    function(err, rows, fields) {
      if (err) return callback(422, err);
      return callback(200, "Type Updated successfully!");
  });
}

function updateMove(id, name, status_effect, callback) {
    if (name == "") return callback(200, "Please select a Move!");

    mysql.pool.query(
    'UPDATE Moves SET name= "' + name + '", status_effect = "' + status_effect + '" WHERE id = ' + id + ';',
    function(err, rows, fields) {
      if (err) return callback(422, err);
      return callback(200, "Move Updated successfully!");
  });
}

function updateLocation(id, name, description, callback) {
    if (name == "") return callback(200, "Please select a Location!");

    mysql.pool.query(
    'UPDATE Locations SET name= "' + name + '", description ="' + description + '" WHERE id = ' + id + ';',
    function(err, rows, fields) {
      if (err) return callback(422, err);
      return callback(200, "Location Updated successfully!");
  });
}

//Delete functions for the page
function delete_Poke(pokeName, callback) {
  if (pokeName == "") return callback(200, "Please select a Pokemon!");

  mysql.pool.query(
  'DELETE FROM Pokemon WHERE name ="' + pokeName + '";',
  function(err, rows, fields) {
    if (err) return callback(422, err);
    return callback(200, "Pokemon Deleted successfully!");
  });	  
}

function delete_Type(typeName, callback) {
  if (typeName == "") return callback(200, "Please select a Type!");

  mysql.pool.query(
  'DELETE FROM Types WHERE name ="' + typeName + '";',
  function(err, rows, fields) {
    if (err) return callback(422, err);
    return callback(200, "Type Deleted successfully!");
  });
}

function delete_Move(moveName, callback) {
    if (moveName == "") return callback(200, "Please select a Move!");

    console.log("The name value was: " + moveName);
    mysql.pool.query(
    'DELETE FROM Moves WHERE name ="' + moveName + '";',
    function(err, rows, fields) {
      if (err) return callback(422, err);
      return callback(200, "Move Deleted successfully!");
  });
}

function delete_Location(locationName, callback) {
  if (locationName == "") return callback(200, "Please select a Location!");

  console.log("The name value was: " + locationName);
  mysql.pool.query(
    'DELETE FROM Locations WHERE name ="' + locationName + '";',
    function(err, rows, fields) {
    if (err) return callback(422, err);
    return callback(200, "Location Deleted successfully!");
  });
}


// D is a object containing all the data sent from the frontend
// It has name, attack, defense, health, speed, and description
// variables, all of which are strings. It has an evolves_to and
// evolves_from variable which are strings representing the ids
// of Pokemon that they evolve to/from. Types and Locations 
// are arrays filled with IDs. Moves is an array filled with
// an object with two fields: id and level. 
function addPokemon(D, callback) {
  // make sure name is unique
  mysql.pool.query(
    "SELECT name FROM Pokemon;", 
    function(err, rows, fields) {
    for (var i = 0; i < rows.length; i++) {
      if (D.name == rows[i].name) {
        return callback(422, "That Pokemon name already exists");
      }
    }
    
    // insert Pokemon itself
    mysql.pool.query(
      'INSERT INTO Pokemon (name, attack, defense, health, speed, description) ' + 
      'VALUES( "' + D.name + '", "' + D.attack + '", "' + D.defense + 
      '", "' + D.health + '", "' + D.speed + '", "' + D.description + '");', 
      function(err, rows, fields) {
      if (err) return callback(422, err);

      // get id from above INSERT statement
      mysql.pool.query(
        'SELECT id FROM Pokemon WHERE name = "' + D.name + '";', 
        function(err, rows, fields) {
        if (err) return callback(422, err);
        var id = rows[0].id;

        // add pokemon types 
        for (var i = 0; i < D.types.length; i++) {
          mysql.pool.query(
            'INSERT INTO Pokemon_Types (poke_id, type_id) ' + 
            'VALUES("' + id + '", "' + D.types[i] + '");', 
            function(err, rows, fields) {
            if (err) return callback(422, err);
          });
        }
            
        // add pokemon moves
        for (var i = 0; i < D.moves.length; i++) {
          mysql.pool.query(
            'INSERT INTO Pokemon_Moves (poke_id, move_id, level) ' + 
            'VALUES("' + id + '", "' + D.moves[i].id + '", "' + D.moves.level + '");', 
            function(err, rows, fields) {
            if (err) return callback(422, err);
          });
        }
                
        if (D.evolves_to) {
          // add evolutions to
          mysql.pool.query(
            'INSERT INTO Evolutions (to_poke, from_poke) ' + 
            'VALUES("' + D.evolves_to + '", "' + id + '");', 
            function(err, rows, fields) {
            if (err) return callback(422, err);
          });
        }

        if (D.evolves_from) {
          // add evolutions from
          mysql.pool.query(
            'INSERT INTO Evolutions (to_poke, from_poke) ' + 
            'VALUES("' + id + '", "' + D.evolves_from + '");', 
            function(err, rows, fields) {
            if (err) return callback(422, err);
          });
        }
        return callback(200, "Pokemon successfully added");
      });
    });
  });
}

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

function addTypeRelation(weak_id, strong_id, callback) {
  if (weak_id === strong_id) return callback(422, "A type cannot be weak or strong against itself");
  
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
      return callback(200, "Type Relation successfully added"); // success!
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

function getPageInfo(col, sortBy, callback) {
  getPokemon(function(pokemon){
    if (sortBy == "ASC") pokemon = tools.sort(pokemon, col, true);
    else pokemon = tools.sort(pokemon, col, false);
    getTypes(function(types){
      getTypeRelations(function(typeRelations){
        getMoves(function(moves){
          getLocations(function(locations) {
            getToEvolutions(function(hasToEvos) {
              var context = { 
                pokemon: pokemon, 
                types: types, 
                typeRelations: typeRelations, 
                moves: moves,
                locations: locations, 
                hasToEvos: hasToEvos
              }
              callback(context);
            });
          });
        });
      });
    });
  });
}

function getPokemon(callback) {
  var getIds = 'SELECT P.id FROM Pokemon P;';
  var getPokeInfo = 
    'SELECT p.id, p.name, p.attack, p.defense, p.health, ' + 
    'p.speed, p.description FROM Pokemon p';
  var getPokeMoves = 
    'SELECT p.id, m.name, pm.level AS level FROM Moves m ' + 
    'INNER JOIN Pokemon_Moves pm ON m.id=pm.move_id ' +
    'INNER JOIN Pokemon p ON pm.poke_id = p.id;';
  var getPokeTypes = 
    'SELECT P.id, T.name AS type FROM Pokemon P ' + 
    'INNER JOIN Pokemon_Types PT on PT.poke_id=P.id ' +
    'INNER JOIN Types T on T.id=PT.type_id;'
  var getPokeLocations = 
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
  mysql.pool.query(getIds, function(err, rows, fields) {
    if (err) throw "ERROR: " + err 
    var ids = rows

    mysql.pool.query(getPokeInfo, function(err, rows, fields) {
      if (err) throw "ERROR: " + err 
      var pokeInfo = rows

      mysql.pool.query(getPokeTypes, function(err, rows, fields) {
        if (err) throw "ERROR: " + err 
        var types = rows

        mysql.pool.query(getPokeMoves, function(err, rows, fields) {
          if (err) throw "ERROR: " + err 
          var moves = rows

          mysql.pool.query(getPokeLocations, function(err, rows, fields) {
            if (err) throw "ERROR: " + err 
            var locations = rows

            mysql.pool.query(getToEvolutions, function(err, rows, fields) {
              if (err) throw "ERROR: " + err 
              var evoTo = rows

              mysql.pool.query(getFromEvolutions, function(err, rows, fields) {
                if (err) throw "ERROR: " + err 
                var evoFrom = rows

                // create pokemon list along with moveSet
                var pokemon = [];

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
                callback(pokemon);
              }); 
            }); 
          }); 
        }); 
      }); 
    }); 
  }); 
}

function getTypes(callback) {
  mysql.pool.query("SELECT name, id FROM Types;", function(err, rows, fields) {
    if (err) throw "ERROR: " + err 

    var types = [];
    for (var j = 0; j < rows.length; j++) {
      types.push({
        name: rows[j].name, 
        id: rows[j].id
      });
    }
    callback(types);
  });
}

function getTypeRelations(callback) {
  // var query = 'SELECT T.name, T.id, T1.weak_id, T1.weak, T2.strong_id, T2.strong FROM Types T LEFT JOIN (SELECT strong_id AS id, weak_id, WN.weak FROM Types_Strength TS LEFT JOIN (SELECT id, name AS "weak" FROM Types) AS WN ON WN.id = TS.weak_id) AS T1 ON T1.id = T.id LEFT JOIN (SELECT weak_id AS id, strong_id, SN.strong FROM Types_Strength TS LEFT JOIN (SELECT id, name AS "strong" FROM Types) AS SN ON SN.id = TS.strong_id) AS T2 ON T2.id = T1.id';
  
  var query = 'SELECT id, name FROM Types;'

  mysql.pool.query(query, function(err, types, fields) {
    if (err) throw "ERROR: " + err

    var weakQ =  'SELECT TS.weak_id as "id", T.name as "weak_against", T.id AS "weak_id" FROM Types T INNER JOIN Types_Strength TS ON T.id = TS.strong_id;'
    mysql.pool.query(weakQ, function(err, weakRows, fields) {
      if (err) throw "ERROR: " + err 

      var strongQ = 'SELECT TS.strong_id as "id", T.name as "strong_against", T.id AS "strong_id" FROM Types T INNER JOIN Types_Strength TS ON T.id = TS.weak_id;'
      mysql.pool.query(strongQ, function(err, strongRows, fields) {
        if (err) throw "ERROR: " + err 
        
        let typeRelations = [];
        for (let i = 0; i < types.length; i++) {
          let row = types[i];
          let newType = {id: row.id, name: row.name, weak_against: [], strong_against: []};
          for (let j = 0; j < weakRows.length; j++) {
            let weak_row = weakRows[j];
            if (row.id == weak_row.id) {
              console.log({id: weak_row.weak_id, name: weak_row.weak_against});
              newType.weak_against.push({id: weak_row.weak_id, name: weak_row.weak_against});
            }
          }

          for (let j = 0; j < strongRows.length; j++) {
            let strong_row = strongRows[j];
            if (row.id == strong_row.id) {
              newType.strong_against.push({id: strong_row.strong_id, name: strong_row.strong_against});
            }
          }
          typeRelations.push(newType);
        }
        callback(typeRelations);
      });
    });
  });
}

function getMoves(callback) {
  mysql.pool.query(
    "SELECT id, name, status_effect FROM Moves;", 
    function(err, rows, fields) {
    if (err) throw "ERROR: " + err 

    // create move list
    var moves = [];
    for (var j = 0; j < rows.length; j++) {
      moves.push({
        id: rows[j].id, 
        name: rows[j].name, 
        status_effect: rows[j].status_effect
      });
    }
    callback(moves);
  });
}

function getLocations(callback) {
  mysql.pool.query(
    "SELECT id, name, description FROM Locations;", 
    function(err, rows, fields) {
    if (err) throw "ERROR: " + err 

    // create location list
    var locations = [];
    for (var j = 0; j < rows.length; j++) {
      locations.push({ 
        id: rows[j].id, 
        name: rows[j].name, 
        description: rows[j].description 
      });
    }
    callback(locations);
  });
}

function getToEvolutions(callback) {
  // get only those ids that have an evolution_to
    var test = 'SELECT DISTINCT T1.id, T1.name FROM (SELECT id, name FROM Pokemon) AS T1 ' + 
    'LEFT JOIN (SELECT to_poke FROM Evolutions) AS T2 ON T1.id = T2.to_poke ' + 
    'WHERE T2.to_poke IS NULL;'; 
  mysql.pool.query(
    'SELECT DISTINCT T1.id, T1.name FROM (SELECT id, name FROM Pokemon) AS T1 ' + 
    'LEFT JOIN (SELECT to_poke FROM Evolutions) AS T2 ON T1.id = T2.to_poke ' + 
    'WHERE T2.to_poke IS NULL;', 
    function(err, rows, fields) {
    if (err) throw "ERROR: " + err 
    
    var toEvos = [];
    for (var i = 0; i < rows.length; i++) {
      toEvos.push({
        id: rows[i].id, 
        name: rows[i].name
      });
    }
    callback(toEvos);
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
