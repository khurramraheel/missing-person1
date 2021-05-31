let mongoose = require('mongoose');

let missingPersonSchema=mongoose.Schema({
    referenceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    mPersonName:String,
    mPersonAge:Number,
    mPersonPic:String,
    mPersonDescription:String
});
let MissingPersons= mongoose.model('mperson',missingPersonSchema);
module.exports=MissingPersons;