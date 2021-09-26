const express = require("express");
const router = express.Router();

const { create, productById, read, remove, update } = require('../controllers/product');


const { requireSignin, isAuth, isAdmin} = require('../controllers/auth');

const {userById} = require('../controllers/user');

router.get('/product/:productId', read)
router.post("/product/create/:userId",
requireSignin,
isAuth, isAdmin,
 create
);

//delete of Product from db
router.delete('/product/:productId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove);

//update of Product from db
router.put('/product/:productId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update);    
//check the param-anytime there is userid in route parameter this param will run and make the user info available in the request object 
router.param('userId',userById);
router.param('productId',productById);

module.exports = router;