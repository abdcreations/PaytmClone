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
        maxLength : 10
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

const User = mongoose.model('User',userSchema);
module.exports = {
    User
};