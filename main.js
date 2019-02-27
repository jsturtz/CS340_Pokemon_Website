// // // for file writing
const fs = require('fs');

// import express, setup express object named "app"
var mysql = require('./dbcon.js');
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
    res.render('create');
});

app.get('/read',function(req,res){
    console.log('This is logging shit'); 
    mysql.pool.query('SELECT * from Pokemon', function(err, rows, fields) {
        
        var pokemon = [];
        for (var i = 0; i < rows.length; i++) {
            var newPoke = {}
            newPoke.name = rows[i].name;
            newPoke.id = rows[i].id;
            newPoke.attack = rows[i].attack;
            newPoke.defense = rows[i].defense;
            newPoke.health = rows[i].health;
            newPoke.speed = rows[i].speed;
            pokemon.push(newPoke);
        }

        console.log(pokemon);
        // create context variable

    });

    var context = {
        pokemon: [
            {
                name: "Charizard", 
                attack: "10", 
                defense: "15", 
                health: "15", 
                speed: "15", 
                types: ["Fire", "Flying"], 
                moves: [
                    {name:"Burn", level:"Innate"}, 
                    {name:"Incinerate", level:"10"}
                ], 
                locations: ["Volcano Land", "Firey Bay"], 
                evolves_from: "Baby CharChar", 
                evolves_to: "Super CharChar"
            }, 

            {
                name: "Ryan Reynolds", 
                attack: "10", 
                defense: "15", 
                speed: "20", 
                health: "20", 
                types: ["Electric", "Deadpool"], 
                moves: [
                    {name:"Pika!", level:"Innate"}, 
                    {name:"Piiiiiikaa!", level:"10"}
                ], 
                locations: ["Hollywood"], 
                evolves_from: "Deadpool", 
                evolves_to: "Pika Deadpool"
            }, 
        ], 

        types: [
            {name: "Grass", weak:"Fire", strong:"Flying"}, 
            {name: "Fire", weak:"Water", strong:"Grass"}
        ], 

        moves: ["Incinerate", "Burn", "Swallow"], 

        locations: [
            {name: "Grassy Knoll", description: "The area is grassy"}, 
            {name: "Volcano", description: "WTF LAVA"}
        ]
    }

    res.render('read', context);
});

app.get('/update',function(req,res){
    res.render('update');
});

app.get('/delete',function(req,res){
    res.render('delete');
});

// app.post('/contact', function(req, res) {
//     var body = JSON.stringify(req.body);
//     fs.appendFile("emails.txt", body, function(err) {});
//     res.redirect('/contact');
// });

/* app.post('/contact', function(req, res) { */

/*     fs.readFile("emails.txt", "utf8", function(err, data) { */
/*         var jsonData = JSON.parse(data); */
/*         jsonData['emails'].push(req.body); */
/*         fs.writeFile("emails.txt", JSON.stringify(jsonData), function(err) {}); */
/*     }); */
/*     res.redirect('/'); */
/* }); */

/* app.get('/resume',function(req,res){ */
/*     res.render('resume'); */
/* }); */

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
