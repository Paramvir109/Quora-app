const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var QuestionSchema = new mongoose.Schema( {
    question : {
        type : String,
        required : true
    },
    askedBy : {
        type : String,
        required : true
    },
    _creator : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    answers : [{
        answer : {
            type : String,
            required : true
        },
        answeredBy : {
            type : String,
            required : true
        }
    }]
})

QuestionSchema.methods.addAnswer = function(text, email) {
    let question = this
    let answer = {
        answer : text,
        answeredBy : email
    }
    question.answers = question.answers.concat([answer])
    return question.save().then(() => {
        return question 
    })
}