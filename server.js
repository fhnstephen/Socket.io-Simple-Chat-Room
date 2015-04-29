#!/usr/bin/env node

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jwt = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var bodyParser = require('body-parser');


var jwtSecret = "123456789";

var users = 0;

io.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.post('/login', function (req, res) {
  var profile = {
    name: req.body.name,
    id: users++,
  };
  var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*24});
  res.json({token: token});
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

['node_modules'].forEach(function (dir) {
  app.use('/' + dir, express.static('./' + dir));
});

['js'].forEach(function (dir) {
  app.use('/' + dir, express.static('assets/' + dir));
});

io.on('connection', function(socket) {
  socket.name = socket.decoded_token.name;
  console.log('Hello', socket.name);
  io.emit('chat message', {name: 'system', mes: socket.name + " has joined the chatroom."});
  socket.on('disconnect', function() {
    console.log('Bye',  socket.name);
  });
  socket.on('chat message', function(mes) {
    io.emit('chat message', {name: socket.name, mes: mes});
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
