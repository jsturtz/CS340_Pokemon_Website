// // // for file writing
const fs = require('fs');

// import express, setup express object named "app"
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
