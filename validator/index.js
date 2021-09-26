const { check } = require('express-validator');


exports.userSignupValidator = [
    check('name', 'Name is requied').notEmpty().withMessage("Name is missing"),
    check('email', 'Please include a valid email').matches(/.+\@.+\..+/)
    .withMessage('Email must contain @'),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }).matches(/\d/)
    .withMessage('Password must contain a number')
   
    ]
   
