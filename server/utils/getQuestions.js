let {Question} = require('./../models/questions')

let getQues = async(email) => {
    let allQuestions = await Question.find({})
    let ourQues = allQuestions.filter((ques) => ques.askedBy === email)
    let otherQues = allQuestions.filter((ques) => ques.askedBy !== email)
    return {ourQues, otherQues}
}

module.exports = {
    getQues
}
