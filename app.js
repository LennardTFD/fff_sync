var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

//var http = require('http');
var app = express();

const http = require("http");

const server = http.createServer({

}, app);

//var server = http.createServer(app);
//let io = require("socket.io").listen(app.listen(3000));
let io = require("socket.io")(server);
var ss = require('socket.io-stream');

io.sockets.on("connection", (socket) => {
  console.log("CONNECTION");
  socket.on("timeStart", (timer) => {
    console.log("timeStart");
    io.sockets.emit("newTime", (new Date()).getTime() + timer);
  });

  ss(socket).on('profile', function(stream, data) {
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream(filename));
  });
});

var indexRouter = require('./routes/index');
//var testRouter = require('./routes/test')(app, io);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next) {
  res.render("index");
});
app.get('/io', (req, res, next) => {res.sendFile(path.join(__dirname, "/node_modules/socket.io-client/dist/socket.io.js"))});

/*
app.use('/', (req, res, next) => {
  res.render("index", {loggedin: req.session.loggedin});
});
*/



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

//server.listen(3000);
server.listen(3000, () => {

  console.log("server started at 3000");

});
module.exports = app;
