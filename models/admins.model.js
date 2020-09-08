var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
      },
    
});

module.exports = mongoose.model('admin', adminSchema);