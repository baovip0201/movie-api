const {model, Schema}=require('mongoose')
const signupSchema= new Schema({
    name: {type: String, require: true},
    userName: {type: String, require: true},
    password: {type: String, require: true}
})

module.exports= model("signupSchema", signupSchema)