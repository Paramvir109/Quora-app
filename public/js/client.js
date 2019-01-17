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
   let html = `<tr>
        <th>S.no.</th>
        <th>Question</th>
    </tr>`
   let userQues = $('#user-ques-table')
   questions.ourQues.forEach((ques,index) => {
        html += `<tr><td>${index + 1}</td>`
        html += `<td><a class="linkToQues"href="question.html">${ques.question}</a> ${ques.answers.length} answer(s)</td></tr>`
   })
   userQues.html(html)
   html = `<tr>
            <th>S.no.</th>
            <th>Question</th>
            <th>Asked by</th>
        </tr>`
   let otherQues = $('#other-user-ques-table')
    questions.otherQues.forEach((ques,index) => {
        html += `<tr><td>${index + 1}</td>`
        html += `<td><a class="linkToQues"href="question.html">${ques.question}</a> ${ques.answers.length} answer(s)</td>`
        html += `<td>${ques.askedBy}</td></tr>`
    })
    otherQues.html(html)
})
socket.on('loginToken', function(token) {
    sessionStorage.setItem('token',token)
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
    
    $(document).on('click','.linkToQues', function(e) {
        e.preventDefault()
        let question = $(this).text()
        let query =  $.param({question})
        document.location.href = '/question.html?' + query
    })
    
})
