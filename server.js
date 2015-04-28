#!/usr/bin/env node

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('chat message', function(mes) {
    io.emit('chat message', mes);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
