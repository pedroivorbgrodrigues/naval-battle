var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var routes = require('./routes.js')

app.use('/', express.static('app'))
var users = 0;
io.on('connection', function (socket) {
    var user = socket.handshake.query.user;
    users++;
    socket.on('chat message', function (msg) {
        msg = '<b>User ' + user + ' diz:</b> ' + msg;
        io.emit('chat message', msg);
    });
});
server.listen(3000);

module.exports = app;