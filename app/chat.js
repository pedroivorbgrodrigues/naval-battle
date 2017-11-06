$(function () {
    $('form[name="chat"]').submit(function () {
        window.chatSocket.emit('chat message', $('#message').val())
        $('#message').val('')
        return false
    });

    window.chat = function(socket){
        socket.on('chat message', function (msg) {
            $('#messages').append($('<li class="list-group-item">').html(msg))
            window.scrollTo(0, document.body.scrollHeight)
        });
        return socket
    }
    
});