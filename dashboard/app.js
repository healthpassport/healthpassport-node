
var express = require('express');
var http = require('http');
var app = express();
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

mongoose.connect('mongodb://localhost/dashboard');
// all environments
app.configure(function(){
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); 
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.json());
});

var UserSchema=new Schema({
	name: String,
	surname: String,
	username: String,
	password: String,
	email: String,
	avatar: String,
	telephone: String,
	address:{
		street:String,
		city: String,
		country:String,
		postcode:String,
		number:Number
	},
	emotions:{
		emotion_type: Number,
		location: String,
		description: String, 
		date: Date
	},
	role: String,
	creation_time: Date,
	update_time: Date
});

var UserModel=mongoose.model('User', UserSchema);
module.exports=mongoose.model('User',UserSchema);

var EmotionSchema=new Schema({
	patient_username: String,
	emotion_type: Number,
	location: String,
	description: String,
	date: Date
});
var EmotionModel=mongoose.model('Emotion', EmotionSchema);
module.exports=mongoose.model('Emotion', EmotionSchema);
//api
//need to find how to display only those with role=doctor
app.get('/home', function(req,res){
	UserModel.find({role:'Patient'},function(err, users){//return only users with role 'Patient'
		if(err)
			res.send(err);
		else
			res.json(users);
	});
});

app.get('/patient/:patient_username', function(req,res){
	EmotionModel.find(function(err, emotions){
		if(err)
			res.send(err);
		else
			res.json(emotions);
	});
});
app.post('/createUser', function(req,res){
	UserModel.create({
		name: req.body.name,
		surname: req.body.surname,
		username: req.body.username,
		password:req.body.password,
		email: req.body.email,
		avatar: req.body.avatar,
		telephone: req.body.telephone,
		address: {
			street:req.body.address.street,
			city:req.body.address.city,
			country:req.body.address.country,
			postcode:req.body.address.postcode,
			number:req.body.address.number,
		},
		role: req.body.role,
		creation_time: new Date(),
		update_time: new Date()
	}, function(err,user){
		if(err)
			res.send(err);
		else	
			res.send(user);
	});
});
app.post('/patient/:patient_username', function(req,res){
	EmotionModel.create({
		emotion_type:req.body.emotion_type,
		patient_username: req.body.username,
		location:req.body.location,
		description:req.body.description,
		date:new Date()
	},function(err,emotion){
		if(err)
			res.send(err);
		else
			res.send(emotion);
	});
});

app.get('/login/:username', function(req,res){
	UserModel.find({
		username: req.params.username
	}, function(err,user){
		if(err)
			res.send(err);
		else
			res.json(user);
	});
});
app.delete('/home/:user_id', function(req,res){
	UserModel.remove(
		{_id: req.params.user_id},
		 function(err, user){
			if(err)
				res.send(err);
			UserModel.find(function(err,data){
				if(err)
					res.send(err);
				else
					res.json(data);

			});
		});
});
app.get('/', function(req,res){
	res.sendfile('./public/index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
