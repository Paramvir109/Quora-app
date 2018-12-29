const http = require('http')
const path = require('path')

const express = require('express')
const socketIO = require('socket.io')
const {mongoose} = require('./db/mongoose')
const {isValidString} = require('./utils/validate')
let {User} = require('./models/users')



let publicPath = path.join(__dirname, '..','/public')
const port = process.env.PORT || 3000

var app = express()
let server = http.createServer(app)
let io = socketIO(server)
app.use(express.static(publicPath))

io.on('connection' ,(socket) => {

    socket.on('new-signup', async (params,callback) => {
        console.log(params)
        if(isValidString(params.email) && isValidString(params.pass)) {
            try {
                let body = {email : params.email, password : params.pass}
                let newUser = new User(body)
                let user = await newUser.save()
            } catch (error) {
                return callback(error.message)
            }
            return callback('Signup successfull. You can login now')
        }
        return callback('Enter valid id and password')
    })
    socket.on('new-login', async (params,callback) => {
        if(isValidString(params.email) && isValidString(params.pass)) {
            try {
                let user = await User.findByCredentials(params.email, params.pass)
                if(user) {
                    let token = user.generateAuthToken()
                    socket.emit('login-token', {token})
                    return callback()
                }
                callback('Incorrect email or pass!')
            } catch (error) {
                return callback(error.message)
            }        
        }
        return callback('Enter valid id and password')
    })
    
})


server.listen(port, () => {
    console.log(`Server is up and running on ${port}`)
})