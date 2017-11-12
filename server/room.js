var boardManager = require('./boardManager')

function _createUser(username, socket) {
    return {
        username: username,
        socket: socket,
        board: '',
        hitBoard: boardManager.createHitBoard(),
        score: 0
    }
}

function createRoom(username, socket) {
    var room = {
        assignUser: function (username, socket, isFirstUser) {
            var user = _createUser(username, socket)
            this._bindSocketEvents(socket, user)
            if (isFirstUser) {
                this.user1 = user
            } else {
                this.user2 = user
                this._emitForRoom('game', 'prepare')
            }
        },
        _emitForRoom: function(action,payload) {
            this.user1.socket.emit(action, payload)
            this.user2.socket.emit(action, payload)
        },
        _getOtherUser: function (username) {
            return this.user1.username == username ? this.user2 : this.user1
        },
        _bindSocketEvents: function(socket, user) {
            var self = this
            socket.on('fire', function(coord) {
                if(self.turn == user.username) {
                    var otherUser = self._getOtherUser(user.username)
                    user.hitBoard[coord.x][coord.y].hit = true                    
                    user.hitBoard[coord.x][coord.y].unit = otherUser.board[coord.x][coord.y].unit                    
                    otherUser.board[coord.x][coord.y].hit = true
                    
                    self.turn = otherUser.username
                    socket.emit('battle', {board: user.board, hitBoard: user.hitBoard})
                    socket.emit('game', 'passTurn')
                    otherUser.socket.emit('battle', {board: otherUser.board, hitBoard: otherUser.hitBoard})
                    otherUser.socket.emit('game', 'myTurn')
                    if(otherUser.board[coord.x][coord.y].unit != 'water') {
                        user.score++;
                        socket.emit('score', user.score)
                        if(user.score == 20) {
                            socket.emit('game-over', true)
                            otherUser.socket.emit('game-over',false)
                        }
                    }
                }
            })
            socket.on('ready', function(state) {
                user.ready = true
                var otherUser = self._getOtherUser(user.username)
                if(otherUser.ready) {
                    self._emitForRoom('game', 'start')
                    self.turn = self.user1.username
                    self.user1.socket.emit('game','myTurn')
                    socket.emit('battle', {board: user.board, hitBoard: user.hitBoard})
                    otherUser.socket.emit('battle', {board: otherUser.board, hitBoard: otherUser.hitBoard})
                }
            })
            socket.on('positionShips', function() {
                user.board = boardManager.createBoard() 
                socket.emit('battle', {board: user.board, hitBoard: user.hitBoard})
            })
        }
    }
    room.assignUser(username, socket, true)
    return room
}

exports.createRoom = createRoom