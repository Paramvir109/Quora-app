var socket = io()
socket.on('connect', function() {
    // let params = $.deparam(window.location.search)
    if(sessionStorage.getItem('token') === null){
        alert('Not authorised');
        document.location.href = '/';

    }
    else{
        socket.emit('reqQuestionThread', {question : sessionStorage.getItem('question')})
    }
    
   

})
socket.on('openQuesThread', (ques) => {
    $('#question-para').html(ques.question)
    let html = `<ul class="w3-ul">`
    ques.answers.forEach((answer) => {
        html += `<li class="w3-animate-opacity">
        <div class="w3-container">
            <p>${answer.answer}</p>
            <p class="w3-right"><span style="font-style:italic">Answered by- ${answer.answeredBy} </span></p>
        </div></li>`
    })
    html += `</ul>`
    $('#answer-list-div').html(html)

})
$('#submit-ans').on('click', function() {
    let answer = $.trim($('#answer-text-area').val())
        if(answer.length === 0) {
            alert('Please enter a valid answer')
        }
        else {
            socket.emit('submitAnswer', {
                answer, 
                token : sessionStorage.getItem('token'),
                question : $.deparam(window.location.search).question
            }, function(err) {
                if(err) {
                    alert(err.message)
                }
                else {
                    alert('Answer posted successfully')
                    let params = $.deparam(window.location.search)
                    socket.emit('reqQuestionThread', params)
                    
                }
                $('#answer-text-area').val('')

            })
        }
})
