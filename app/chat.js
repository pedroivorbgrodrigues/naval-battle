$(function () {
    var socket = io();
    $('form').submit(function () {
        socket.emit('chat message', $('#message').val());
        $('#message').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li class="list-group-item">').html(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
});