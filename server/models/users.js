const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


var UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        unique : true,
        validate : {
            validator : validator.isEmail,
            message : '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 6,

    }
    
})

UserSchema.methods.toJSON = function() {//Overrided method
    let userObject = this.toObject()
    return _.pick(userObject, ['email' , '_id'])//Only these props sent back
}



UserSchema.statics.findByCredentials = async function(email, password) {
    let User = this;
    try {
        let user = await User.findOne({email})
        let res = await bcrypt.compare(password, user.password)
        if(res) {
            return user
        }
        throw new Error('Incorrect email or password')
    } catch (error) {
        throw new Error(error.message)
    }


}
UserSchema.methods.generateAuthToken = function () {
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id : user._id, access},process.env.JWT_SECRET).toString()
    return Promise.resolve(token)

}

UserSchema.statics.findByToken =  function(token) {
    let User = this;
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return Promise.reject();
    }
    return User.findOne({
        '_id' : decoded._id,
    })

}


UserSchema.pre('save', function(next) {//mongoose middleware
    var user = this//To get current instance 
    if(user.isModified('password')) {
        bcrypt.genSalt(10).then((salt) => {
            //more the no. of rounds more time bcrypt algo takes(prevent bruteforce attack)
            return bcrypt.hash(user.password, salt)
          }).then((hash) => {
            user.password = hash
            next()
          }).catch((e) =>{next(e)})
    }else {
        next();//if only emil is changed we dont want to generate new hash password
    }
})
var User = mongoose.model('User', UserSchema)
module.exports = {User}

