const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    followtags: [{
        tag: {type: String, require: true},
        followtime: {type: String, require: true}
    }],
    customtags: [{
        tag: {type: String, require: true},
        followtime: {type: String, require: true}
    }],
    history: {type: [String], require: true}
    },
    { timestamps: true }
  );

const User = mongoose.model('User', userSchema);

module.exports = User;