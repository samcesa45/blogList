const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        minLength:3
    },
    name:{
        type:String,
        minLength:3
    },
    password:{
        type:String
    },
    blogs:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
       }
    ]
})


userSchema.set('toJSON', {
    transform:(_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        //delete the hashpassword
        delete returnedObject.password
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User