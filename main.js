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
app.set('port', 3191);
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
  getPageInfo(function(info) {
    res.render('create', info);
  })
});

app.get('/read',function(req,res){
  getPageInfo(function(info) {
    res.render('read', info);
  });
});

app.post('/create', function(req, res) {
  console.log('this code is hit');
  switch(req.body.action) {
    case "type": 
      addType(req.body.name, function(){
      }); 
      break; 

    case "type-relation":
      addTypeRelation(
        req.body.name, 
        req.body.weak, 
        req.body.strong, 
        function() {}
      );
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
  var query = "SELECT name FROM Types;"
  mysql.pool.query(query, function(err, rows, fields) {
    if (err) throw "ERROR: " + err;

    for (var i = 0; i < rows.length; i++) {
      if (name.toLowerCase() == rows[i].name.toLowerCase()) {
        return false;
      }
    }
    
    query = 'INSERT INTO Types (name) VALUES ("' + name + '")';
    mysql.pool.query(query, function(err, rows, fields) {
      if (err) throw "ERROR: " + err;
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
    'SELECT T.name, T1.strong_against, T2.weak_against FROM Types T ' + 
    'INNER JOIN ( ' + 
    'SELECT strong_id AS id, weak_id AS "strong_against" FROM Types_Strength ' + 
    ') AS T1 ON T1.id = T.id  ' + 
    'INNER JOIN ( ' + 
    'SELECT weak_id AS id, strong_id AS "weak_against" FROM Types_Strength ' + 
    ') AS T2 on T2.id = T.id;';

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
