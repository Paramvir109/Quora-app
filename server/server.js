const http = require('http')
const path = require('path')

require('./config/config.js')
const express = require('express')
const socketIO = require('socket.io')
const {mongoose} = require('./db/mongoose')
const {isValidString} = require('./utils/validate')
let {User} = require('./models/users')
let {Question} = require('./models/questions')




let publicPath = path.join(__dirname, '..','/public')
const port = process.env.PORT || 3000

var app = express()
let server = http.createServer(app)
let io = socketIO(server)
app.use(express.static(publicPath))

io.on('connection' ,(socket) => {
   

    socket.on('newSignup', async (params,callback) => {
        if(isValidString(params.email) && isValidString(params.pass)) {
            try {
                let body = {email : params.email, password : params.pass}
                let newUser = new User(body)
                await newUser.save()
            } catch (error) {
                return callback(error.message)
            }
            return callback('Signup successfull. You can login now')
        }
        return callback('Enter valid id and password')
    })
    socket.on('newLogin', async (params,callback) => {
        if(isValidString(params.email) && isValidString(params.pass)) {
            try {
                let user = await User.findByCredentials(params.email, params.pass)
                if(user) {
                    let token = await user.generateAuthToken()
                    let allQuestions = await Question.find({})
                    let ourQues = allQuestions.filter((ques) => ques.askedBy === params.email)
                    let otherQues = allQuestions.filter((ques) => ques.askedBy !== params.email)
                    
                    socket.emit('populateQuestions', {ourQues,otherQues})
                    socket.emit('loginToken', token)//This order is necessary
                    
                    return callback()
                    
                }
                callback('Incorrect email or pass!')
            } catch (error) {
                return callback(error.message)
            }        
        }
        return callback('Enter valid id and password')
    })
    socket.on('disconnect' , async() => {
        // let user = await User.findBySocketID(socket.id)
        // if(user) {//user can return null when we just signup
        //     await user.removeToken(socket.id)
        // }
        
    })
    socket.on('submitQuestion' ,async (params,callback) => {
        try {
            let user = await User.findByToken(params.token) 
            if(user) {
                let myQuestion = new Question({
                        question : params.questionText,
                        askedBy : user.email,
                        _creator : user._id,
                })
                await myQuestion.save()
                return callback()
            }
            else {
                return callback('Unauthorised')
            }
        } catch (error) {
            return callback(e.message)
        }
        
    })
    socket.on('reqQuestionThread', (params) => {
        Question.findOne({question:params.question}).then((ques) => {
            socket.emit('openQuesThread', ques)
        })
    })
    socket.on('submitAnswer', async(params, callback) => {
        try {
            let user = await User.findByToken(params.token)
            let ques = await Question.findOne({question : params.question})
            await ques.addAnswer(params.answer, user.email)
            callback()
        } catch (error) {
            callback(error.message)
        }
        
        
    })
    socket.on('removeQues', async(params, callback) => {
        try {
            let user = await User.findByToken(params.token)
            let removedQues = await Question.findOneAndDelete({question:params.question,askedBy : user.email})
            callback()
        } catch (error) {
            callback(error.message)
        }
        
        
    })
    
    
})


server.listen(port, () => {
    console.log(`Server is up and running on ${port}`)
})
module.exports = {app,server,io}
//When I shut the server down, the authToken is not removed and saved in database
//Duplicate ques should not be allowed
//Opening ques pagee creates new socket and deletes prev token
