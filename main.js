// // // for file writing
const fs = require('fs');

// import express, setup express object named "app"
var express = require('express');
var app = express();

// import handlebars and bodyParser
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

// tells app to either use urlencoded or json depending on what it parses
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// more boiler plate stuff
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3291);

// makes "public" the location to serve static files (images, css, html)
app.use(express.static('public', { extensions: ['html'] }));

// portfolio is the home page
app.get('/',function(req,res){
    res.render('portfolio');
});

app.get('/',function(req,res){
    res.render('portfolio');
});

app.get('/about',function(req,res){
    res.render('about');
});

app.get('/contact',function(req,res){
    res.render('contact');
});

// app.post('/contact', function(req, res) {
//     var body = JSON.stringify(req.body);
//     fs.appendFile("emails.txt", body, function(err) {});
//     res.redirect('/contact');
// });

app.post('/contact', function(req, res) {

    fs.readFile("emails.txt", "utf8", function(err, data) {
        var jsonData = JSON.parse(data);
        jsonData['emails'].push(req.body);
        fs.writeFile("emails.txt", JSON.stringify(jsonData), function(err) {});
    });
    res.redirect('/');
});

app.get('/resume',function(req,res){
    res.render('resume');
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
