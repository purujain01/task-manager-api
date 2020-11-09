const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Incorrect email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Do not include password in it')
            }
        }
    },
    age: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},
{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
 
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generatetoken = async function(){
    const token = jwt.sign({ _id: this._id.toString() }, process.env.AUTH_STRING)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.statics.findByverify = async (email,password)=>{
    const User = await users.findOne({email})
    if(!User){
        throw new Error('Unable to login')
    }
    const verify = await bcrypt.compare(password,User.password)
    if(!verify){
        throw new Error('Unable to login')
    }
    return User 
}

userSchema.pre('save',async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove',async function(next) {

    await Task.deleteMany({ owner: this._id })
    next()
})
const users = mongoose.model('users',userSchema)

module.exports = users