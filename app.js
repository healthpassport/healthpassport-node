var express = require('express');
var async = require('async');
var http = require('http');
var path = require('path');
var app = express();
// var db = require('./classes/mysql');

var api = require('./routes/api');
var user = require('./routes/user');

app.get('/', function(req, res){
  res.json({msg:"Hello"});
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Users
app.get('/api/v1/users', user.query, api.json);
app.post('/api/v1/users', user.create, api.json);

// User
app.get('/api/v1/users/:userId', user.get, api.json);
app.del('/api/v1/users/:userId', user.del, api.json);
app.put('/api/v1/users/:userId', user.update, api.json);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
