var socket = io()

socket.on('connect', function() {
    let params = $.deparam(window.location.search)
    if(params.type === 'login') {
        socket.emit('new-login',params ,function(err) {
            if(err) {
                alert(err)
                window.location.href = '/'
            }
           
        })
    } 
    else {
        socket.emit('new-signup',params ,function(err) {
            if(err) {
                alert(err)
                window.location.href = '/'
            }
           
        })
    }
})
socket.on('login-token', function(token) {
    
})