let mongoose = require('mongoose');

let missingPersonSchema = mongoose.Schema({
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        date: Date,
        message: String
    }],
    location: {
        latitude: 0,
        longitude: 0
    },
    mPersonName: String,
    mPersonAge: Number,
    mPersonPic: String,
    mPersonDescription: String
});
let MissingPersons = mongoose.model('mperson', missingPersonSchema);
module.exports = MissingPersons;