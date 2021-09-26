const User = require('../models/user');
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt');// for authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');

//signup
exports.signup = (req,res) => {
    console.log('req.body',req.body);
    const user = new User(req.body);
    user.save((err, user) => {
            if(err){
                return res.this.status(400).json({
                    err:errorHandler(err)
                });

            }
            //this don't show salt and hashed password in postman
            user.salt = undefined;
            user.hash_password = undefined;
            res.json({
                user
            });
    });

    const errors = validationResult(req);
  
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
}

//signin
exports.signin = (req, res) => {
    //find the user based on email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {//find the user find based on email
        if(err, user) {
            if(err || !user){ //if we don't find the user then this w'll happen
                return res.status(400).json({
                    error: "User with that email does not exist. Please signup"
                });
            }
        }
        //if user is found then make sure the email and password match
        //create authenticate method in user model

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password don't match"
            });
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET)
        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, {expire:new Date() + 9999})
        //return response with user and token to frontend client
        const {_id, name, email, role} = user 
        return res.json({token, user: {_id, email, name, role}})



    })
};    
//signout
exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({message: "Signout Success"});
}
//requireSignin-use this as a middleware to protect any routes
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user){
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role == 0){ //this mean it is not admin b/c of 0
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};
// exports.login = async (req, res) => {
//     this.printLog();
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
//     const { email, password } = req.body;
//     try {
//         //User exist or not
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json(setErrorMsg('Invalid credentials'));
//         //Password matches or not
//         const password = await bcrypt.compare(password, user.password);
//         if (!password) return res.status(401).json(setErrorMsg('Invalid credentials'));
//         jwt.sign(
//             { user: { id: user.id } },
//             config.get('jwtSecret'),
//             { expiresIn: 36000 },
//             (err, token) => {
//                 if (err) return res.status(500).json(setErrorMsg('Token issue from server'))
//                 res.json({ message: 'Logged in successfully', token });
//             }
//         )
//     } catch (error) {
//         res.status(500).json(setErrorMsg(error.message));
//     }
// }
