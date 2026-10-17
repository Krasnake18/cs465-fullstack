require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');
var apiRouter = require('./app_api/routes/index');

var handlebars = require('hbs');
// Wire in our authentication module

require('./app_api/config/passport');
// Bring in the database
require('./app_api/models/db');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

handlebars.registerPartials(path.join(__dirname, 'app_server/views/partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Enable CORS
app.use('/', (req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        'http://localhost:4200'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// Catch unauthorized errors and create 401 response
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res
            .status(401)
            .json({
                "message": err.name + ": " + err.message
            });
    }
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;