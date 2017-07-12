var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});
//basics
router.get('/basics', function(req, res){
	res.render('basics');
});
//alphabets
router.get('/alphabets', function(req, res){
	res.render('alphabets');
});
//numbers
router.get('/numbers', function(req, res){
	res.render('number');
});
//tos
router.get('/tos', function(req, res){
	res.render('tos', {layout: false});
});
//quiz
router.get('/quiz', function(req, res){
	res.render('quiz', {layout: false});
});
//dictionary
router.get('/dictionary', function(req, res){
	res.render('dictionary', {layout: false});
});
//words
router.get('/words', function(req, res){
	res.render('words', {layout: false});
});
//pronounce
router.get('/pronounce', function(req, res){
	res.render('pronounce', {layout: false});
});
router.get('/foods', function(req, res){
	res.render('foods', {layout: false});
});
router.get('/animals', function(req, res){
	res.render('animals', {layout: false});
});
router.get('/directions', function(req, res){
	res.render('directions', {layout: false});
});
router.get('/emotions', function(req, res){
	res.render('emotions', {layout: false});
});
router.get('/family', function(req, res){
	res.render('family', {layout: false});
});
router.get('/colors', function(req, res){
	res.render('colors', {layout: false});
});
router.get('/number', function(req, res){
	res.render('number', {layout: false});
});
router.get('/pronouns', function(req, res){
	res.render('pronouns', {layout: false});
});
router.get('/greetings', function(req, res){
	res.render('greetings', {layout: false});
});
// Login
router.get('/login', function(req, res){
	res.render('login');
});
// Test
router.get('/test', function(req, res){
	res.render('test');
// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;
