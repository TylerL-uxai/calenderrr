/**
 *  Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
var mongo = require('mongodb');
  , EmployeeProvider = require('./employeeprovider').EmployeeProvider;
var mongodb = require('mongodb');
var logger = require('./logger.js');



var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//var employeeProvider= new EmployeeProvider('localhost', 27017);

var employeeProvider= process.env.MONGOLAB_URI || 'mongodb://localhost/test';


// new stuff

var MONGODB_URI = 'mongodb://localhost';
var db;
var coll;

// Initialize connection once, reuse the database object 

mongodb.MongoClient.connect(MONGODB_URI, { server: { logger: logger(MONGODB_URI) } }, function(err, database) {
  if(err) throw err;
 
  db = database;
  coll = db.collection('test');

  app.listen(3000);
  console.log('Listening on port 3000');
});

app.get('/', function(req, res) { 
  coll.find({}, function(err, docs) {
    docs.each(function(err, doc) {
      if(doc) {
        res.write(JSON.stringify(doc) + "\n");
      }
      else {
        res.end();
      }
    });
  });
});

app.get('/post', function(req, res) {
  coll.insert({ randomNumber: Math.random() }, function(err) {
    res.end('Successful Insert!');
  })
});


//Routes

app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Employees',
            employees:emps
        });
  });
});

app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.listen(8080);
