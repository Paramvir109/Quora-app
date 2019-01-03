const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken');


const {User} = require('./../../models/users')
const user1ID = new ObjectID()
const user2ID = new ObjectID()


const myUser = [
    {
        _id : user1ID,
        email : 'okay@ymail.com',
        password : 'userpassone',
        tokens : [
            {
            access : 'auth',
            token : jwt.sign({_id : user1ID, access : 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id : user2ID,
        email : 'okay2@ymail.com',
        password : 'userpasstwo',
        tokens : [
            {
            access : 'auth',
            token : jwt.sign({_id : user2ID, access : 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    }

]
const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        let userOne = new User(myUser[0]).save()
        let userTwo = new User(myUser[1]).save()
        
       return Promise.all([userOne, userTwo])
    }).then(() => done()).catch((e) => done(e))

}
module.exports = {

    myUser,
    populateUsers
}