require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const options = require('./knexfile.js');
const knex = require('knex')(options);
const helmet = require('helmet');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./docs/swagger.yaml');

const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('./sslcert/cert.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.oem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate
}

//Routing
const stocksRouter = require('./routes/stocks');
const userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  req.db = knex
  next()
})


app.use('/stocks', stocksRouter);
app.use('/user', userRouter);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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

const server = https.createServer(credentials, app);
server.listen(443);

module.exports = app;
