const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

const bodyParser = require('body-parser');

const users = require('./routes/user');
const solicitudes = require('./routes/solicitud');
const CambiosSoliciud = require('./routes/cambio_solicitud');
const solicitudesVarias = require('./solicitudesVarias');
const archivo = require('./routes/archivo');
const constantes = require('./routes/constantes');
const notification = require('./routes/notification');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/solicitudes', solicitudes);
app.use('/users', users);
app.use('/cambiosSolicitud', CambiosSoliciud);
app.use('/solicitudesVarias', solicitudesVarias);
app.use('/archivo', archivo);
app.use('/constantes', constantes);
app.use('/notification', notification);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token');
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
