var socket = io()


socket.on('connect', function() {
    let params = $.deparam(window.location.search)
    if(params.type === 'login') {
        socket.emit('newLogin',params ,function(err) {
            if(err) {
                alert(err)
                window.location.href = '/'
            }
            
           
        })
    } 
    else {
        socket.emit('newSignup',params ,function(err) {
            if(err) {
                alert(err)
                window.location.href = '/'
            }
           
        })
    }
})
socket.on('populateQuestions', function(questions) {
   let html = ``
   let userQues = $('#user-ques-list')
   questions.ourQues.forEach((ques) => {
       html += `<li>${ques.question} <span>${ques.askedBy}</span></li>`
   })
   userQues.html(html)
   html = ``
   let otherQues = $('#other-user-ques-list')
   questions.otherQues.forEach((ques) => {
       html += `<li>${ques.question} <span>${ques.askedBy}</span></li>`
   })
   otherQues.html(html)
})
socket.on('loginToken', function(token) {
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
            socket.emit('submitQuestion', req, function(err) {
                if(err) {
                    alert(err)
                }
                else {
                    alert('Question posted successfully')
                    $('#question-text-area').val('')
                    $("#question-modal").css("display","none")
                }
            })
        }
    })
    
})