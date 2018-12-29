const mongoose = require('mongoose')
mongoose.Promise  = global.Promise;//To tell mongoose we'll be using our inbuilt promise library

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/QuoraApp', {useNewUrlParser : true})
//QuoraApp will be the name of database

module.exports.mongoose = mongoose;