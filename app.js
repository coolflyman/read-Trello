var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var readjsonRouter = require('./routes/readjsonRouter');
var users = require('./routes/users');
var RedisStore = require('connect-redis')(session);
var redisStore = new RedisStore();
//var session_store = require('express-session/session/memory');

var app = express();

//TODO: put below to config.js
var appName = "readTrello";
var appMain = '/readTrello';
var appKey = 'a788a8642a5a25d1ad93d69280d9bcc5';
var secret = "cf3204bf4bfc4d79c97d5a97df126378b8c5574cbba2ace03c4d5c60adca1ba4";
var queryMemStr = "1/members/me/boards";
var queryByBoardIdStr = "1/boards/$/lists";
var queryByListIdStr = "1/lists/$/cards";
// var loginCallback = path.join("http://uckkd9531184.coolflyman.koding.io:" + process.env.PORT,'cb');
var loginCallback = path.join("http://",process.env.APP_IP + ":" + process.env.PORT,'cb');
console.log('loginCallback: ',loginCallback);

app.locals.loginCallback = loginCallback;
app.locals.appMain = appMain;
app.locals.appName = appName;
app.locals.appkey = appKey;
app.locals.secret = secret;

app.locals.queryMemStr = queryMemStr;
app.locals.queryByBoardIdStr = queryByBoardIdStr;
app.locals.queryByListIdStr = queryByListIdStr;

//=============== put above to config.js



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var sessionMiddleware = session({
  secret: 'WTF',
  resave: false,
  saveUninitialized: true,
  //cookie:{},
  store: redisStore
});
app.locals.sessionMiddleware = sessionMiddleware;
app.use(sessionMiddleware);

app.use('/', routes);
app.use(appMain, readjsonRouter);
app.use('/users', users);

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
