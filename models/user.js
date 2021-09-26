const mongoose = require('mongoose');
const crypto = require('crypto');
//const uuidv1 = require('uuid/v1');
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,//any space between the start and end will be trim out
        required: true,
        maxlength: 32
    },
    email:{
        type: String,
        trim: true,//any space between the start and end will be trim out
        required: true,
        unique: 32
    },
    hash_password:{
        type: String,
        required: true,
        
    },
    about:{
        type: String,
        trim: true,//any space between the start and end will be trim out
    },
    salt: String, //to generate the hash password
    role:{ //there are 2 role 1 will be admin 0 will be other user
        type: Number,
        default: 0
    },
    history:{
        //will be able to see previous item that will be purchased
        type: Array,
        default: []
    }
},
{timestamps: true}
);

// virtual field

userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.hash_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
});

userSchema.methods = {
    
    //signin auth
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hash_password;
    },
    
    encryptPassword: function(password){
        if(!password) return "";
        try{
            return crypto.createHmac("sha1",this.salt)
                            .update(password)
                            .digest("hex");
        }catch(err){
            return "";
        }
    }
};

module.exports = mongoose.model("User",userSchema);