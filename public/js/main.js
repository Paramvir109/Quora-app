$(document).mouseup(function(e) 
{
    var container = $("#question-box");

    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        $("#question-modal").css("display","none")
    }
});
// $('#submit-ques').on('click', function() {
//     let questionText = $.trim($('#question-text-area').val())
//     if(questionText.length === 0) {
//         alert('Please enter a valid question')
//     }
// })