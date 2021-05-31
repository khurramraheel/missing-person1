let mongoose = require('mongoose');

let userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    contact:String
});
let Users= mongoose.model('user',userSchema);
module.exports=Users;