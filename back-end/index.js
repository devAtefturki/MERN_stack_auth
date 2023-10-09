const express = require ('express');
const users= require('./routes/userRoutes')
const cors = require ('cors');
const db = require('./database/index');
require("dotenv").config();
const PORT = 4000;

const cookieParser = require('cookie-parser');



const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials:true}))
app.use(cookieParser())

app.get("/",(req,res)=>res.json('are you a webcrawler? nothing to see here!'))

app.use('/users',users)
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));