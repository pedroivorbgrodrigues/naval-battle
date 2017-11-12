var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var _ = require('lodash')
var roomManager = require('./server/room')
var PORT = process.env.PORT || 3000
app.use('/', express.static('client'))

var users = 0
var messages = []
var rooms = []

function assignRoom(username, socket) {
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        if (!_.has(room, 'user2')) {
            room.assignUser(username, socket)
            //send mensage
            return
        }
    }
    rooms.push(roomManager.createRoom(username, socket))
}

io.on('connection', function (socket) {
    var username = socket.handshake.query.user
    users++
    assignRoom(username, socket)
    // bindChat(socket, user, room)
});

// function bindChat(socket, user, room) {
//     socket.on('chat-message', function (msg) {
//         msg = '<b>User ' + user + ' diz:</b> ' + msg
//         messages.push(msg)
//         emmitForRoom(room, 'chat-message', msg);
//     });
    
//     socket.emit('chat-init', messages)
// }

server.listen(PORT)
console.log('server listening on port: '+PORT)
module.exports = app