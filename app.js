var express = require('express');
var async = require('async');
var http = require('http');
var path = require('path');
var __ = require('underscore');
var ejs = require("ejs");

var app = express();

var db = require('./classes/mysql');
var api = require('./routes/api');
var user = require('./routes/user');
var info = require('./routes/info');

app.configure(function(){
  app.use(express.bodyParser());
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set("view engine", "ejs");
  app.engine("html", ejs.renderFile);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
});

app.get('/', function(req, res) {
  res.render('index.html')
});

app.get('/api', function(req, res){
  console.log(app.routes);
  res.json(__.map(app.routes, function(routeSet){
    return __.map(routeSet, function(route) {
      return {path: route.path, method:route.method}
    });
  }));
});

// Users
app.get('/api/v1/users', user.query, api.json);
app.post('/api/v1/users', user.create, api.json);

// User
app.get('/api/v1/users/:username', user.get, api.json);
app.del('/api/v1/users/:username', user.del, api.json);
app.put('/api/v1/users/:username', user.update, api.json);

// Infos
app.get('/api/v1/users/:username/info', info.query, api.json);
app.post('/api/v1/users/:username/info', info.create, api.json);

// Info
app.get('/api/v1/users/:username/info/:info_type', info.get, api.json);
app.del('/api/v1/users/:username/info/:info_type', info.del, api.json);
app.put('/api/v1/users/:username/info/:info_type', info.update, api.json);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
