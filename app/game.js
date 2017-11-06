$(function(){
    window.chatSocket = {}
    window.gameSocket = {}
    $('#login-modal').modal({backdrop: 'static'})
    $('form[name="login"]').submit(function () { 
        var username = $('input[name="username"]')
        if(username.val().length > 3) {
            window.chatSocket = window.chat(io({query: {user: username.val()}}))
            username.val('')
            var game = new p5(createBoard, 'naval-field')
            username.parent().toggleClass('has-error', false)
            $('#login-modal').modal('hide')
        } else {
            username.parent().toggleClass('has-error', true)
        }
        return false
    });
    
})