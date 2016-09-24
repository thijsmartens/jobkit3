var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    process.nextTick(function () {
        User.findOne({'email': email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, {message: 'Dit emailadres is al in gebruik.'});
            }
            if (password.length < 6) {
                return done(null, false, {message: 'Het wachtwoord moet minstens 6 karakters tellen.'});
            }

            if (password != req.body.confirm_password) {
                return done(null, false, {message: 'De wachtwoorden komen niet overeen.'});
            }
            if (password.length < 6) {
                return done(null, false, {message: 'Het wachtwoord moet minstens 6 karakters tellen.'});
            }
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.info = req.body.info;


            newUser.save(function (err, result) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({'email': email}, function (err, user) {
        if (err) {            
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'Geen gebruiker met dit emailadres gevonden'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Verkeerd paswoord'});
        }
        
        
        return done(null, user);
    });
}));