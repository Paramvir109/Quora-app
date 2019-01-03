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
    $('#submit-ques').on('click', function() {
        let questionText = $.trim($('#question-text-area').val())
        if(questionText.length === 0) {
            alert('Please enter a valid question')
        }
        else {
            let req = {
                questionText,
                token
            }
            console.log(req)
            socket.emit('submit-question', req, function(err) {
                if(err) {
                    alert(err)
                }
            })
        }
    })
    
})