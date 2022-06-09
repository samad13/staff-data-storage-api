const express = require("express")
const app = express()
const mongoose = require("mongoose")
const router = express.Router();
require("dotenv/config");
const morgan = require('morgan')
const profilesRouter = require('./routers/profiles');
const usersRouter = require('./routers/users');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handlers')



//login
// search by name or id
//then it will bring th information needed from the database individually
//use the token for now
const api = process.env.API_URL


app.use(express.static('public'))
app.use(express.json());
app.use(morgan('tiny'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(authJwt());
app.use(errorHandler);
app.use(`${api}/profiles`, profilesRouter);
app.use(`${api}/users`, usersRouter);




    mongoose.connect(process.env.CONNECTION_STRING,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },(err) =>{
        if (err) {
            console.log(err)
        }else {
            console.log('database connection succesful')
        }
    })









app.listen(4000,()=> console.log("app listening at 3000" ))