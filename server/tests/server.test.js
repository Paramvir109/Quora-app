const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')


const {server,app,io} = require('./../server.js')//Or use destructuring
const {User} = require('./../models/users')
const {myUser,populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
describe('Signup user', () => {
    it('Should add user into db', (done) => {
        request(server)
        .get('/main.html?type=signup&email=abc%40234.com&pass=12345678')
        .emit('connect')
        .expect((res) => {
            console.log(res)
        })
        .end(() => {
            User.countDocuments({}).then((count) => {
                expect(count).toBe(3)
                done()
            }).catch((e) => {
                done(e)
            })
            
        })
    })
})