$(function(){
    window.mySocket = {}
    
    $('#login-modal').modal({backdrop: 'static'})
    
    $('form[name="login"]').submit(function () { 
        var username = $('input[name="username"]')
        if(username.val().length > 3) {
            openSocket(username.val())
            $('h3').append('  -  <b>'+username.val()+'</b>')
            
            username.val('')
            username.parent().toggleClass('has-error', false)
            $('#login-modal').modal('hide')
        } else {
            username.parent().toggleClass('has-error', true)
        }
        return false
    });

    var actions = {
        myTurn: function () {
            $('#my-turn').show()
            $('#opponent-turn').hide()    
        },
        passTurn: function () {
            $('#my-turn').hide()
            $('#opponent-turn').show()    
        },
        prepare: function () {
            var prepareButtons = $('#prepare-buttons')
            new p5(createBoard, 'naval-field')
            prepareButtons.append('<div id="btnPositionShips" class="btn btn-primary">Position Ships</div>')
            prepareButtons.append('<div id="btnReady" class="btn btn-success">Ready</div>')
            prepareButtons.on('click', '#btnPositionShips', function(event) {
                window.mySocket.emit('positionShips', {})
            })
            prepareButtons.on('click', '#btnReady', function(event) {                
                window.mySocket.emit('ready', true)
                if(!$(this).hasClass('active')) {
                    $(this).addClass('active')
                    $(this).attr('disabled', 'disabled' )
                }
                $('#btnPositionShips').attr('disabled', 'disabled' )
            })
        },
        start: function () {
            $('#prepare-buttons').html('')
            new p5(createBoard, 'naval-hits')
        }
    }
    
    function openSocket(username) {
        window.mySocket = io({query: {user: username}})
        // bindChat(window.mySocket)
        bindLog(window.mySocket)
        window.mySocket.on('game', function(action) {
            actions[action]()
        })
        window.mySocket.on('score', function(score) {
            $('#score').text(score)
        })
        window.mySocket.on('game-over', function(win){
            if(win) {
                $('#winner').show()
            } else {
                $('#looser').show()
            }
            $('#game-over-modal').modal({backdrop: 'static'})
        })
    }
    
    $('form[name="chat"]').submit(function () {
        window.mySocket.emit('chat-message', $('#message').val())
        $('#message').val('')
        return false
    });

    // function bindChat(socket) {
    //     socket.on('chat-message', function (msg) {
    //         $('#messages').append($('<li class="list-group-item">').html(msg))
    //         window.scrollTo(0, document.body.scrollHeight)
    //     });
    //     socket.on('chat-init', function (history) {
    //         history.forEach(function(entry) {
    //             $('#messages').append($('<li class="list-group-item">').html(entry))    
    //         })
    //     });
    // }
    
    function bindLog(socket) {
        socket.on('log', function (msg) {
            $('#log').append($('<li class="list-group-item">').html(msg))
        });
    }
})