const mongoose = require('mongoose');
const URL = ""
mongoose.connect(URL).then(() => console.log("connected"));


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique: true,
        trim : true,
        lowerCase : true,
        minLength : 3, 
        maxLength : 50
    },
    password: {
        type : String,
        required : true,
        minLength : 6

    },
    firstName:{
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    },
    lastName: {
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    }
});

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account',accountSchema);

module.exports = {
    User,
    Account
};