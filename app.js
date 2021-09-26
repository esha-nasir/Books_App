const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');//will be saving the user's credential in the cookie



require('dotenv').config();
//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true

}).then(() => console.log('Database Connected'));

//morgan as middleware
app.use(morgan("dev"));
//body-parser as middlewar
app.use(bodyParser.json()); //get json data from the request body
//user cookie parser as middlewar
app.use(cookieParser());
//routes - userRoutes use as a middleware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
    
const port = process.env.PORT || 8000

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});