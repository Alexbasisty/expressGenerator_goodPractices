let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let expressRateLimit = require('express-rate-limit');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressRateLimit({windowMs: 2000 * 60, max: 5})); 

app.use('/', indexRouter);
app.use('/users', usersRouter);

let user = {
  name: 'Alex',
  modified: new Date()
}
app.set('etag', 'strong');

app.param('name', (req, res, next, name) => {
  req.name = name;
  next();
});

app.get('/user', (req, res) => {
  res.append('Last-Modified', user.modified.toDateString())
  res.json(user)
})

app.put('/user/:name', (req, res) => {
   res.append('Last-Modified', user.modified.toDateString())
   user.name = req.name;
   user.modified = new Date();
   res.json(user);
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
