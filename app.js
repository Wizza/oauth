var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var oauthserver = require('oauth2-server');
var oauthModel = require('./models/oauth');
var oauth = require('./routes/oauth');

var app = express();
//var db  = require("./db");

var knex = require('knex')({
  client: 'pg',
  connection: 'postgres://postgres:password@localhost/database'
});

require('bookshelf')(knex);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.oauth = oauthserver({
    model: oauthModel, // See below for specification
    grants: ['password', 'refresh_token'],
    debug: false,
    accessTokenLifetime: 5
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', function (req, res) {
  res.render('login');
});

app.get('/secure', app.oauth.authorise(), function (req, res) {
  res.json({ code: 200, message: 'Secrete Area' });
});

app.get('/load', function(req, res){
    oauthModel.load();
    res.send('Done');
});

app.use(app.oauth.errorHandler());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
