require('dotenv').config();
const {check} = require('express-validator')
const bcrypt=require('bcrypt')
const db= require('../database/index')
const jwt= require('jsonwebtoken')
const nodemailer= require('nodemailer');
const emailValidator=require('deep-email-validator')

async function isEmailValid(email){
    return emailValidator.validate(email)

}
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`
    }
});

const send=(text,email,subject)=>{


    transporter.sendMail({
        from:`${process.env.EMAIL}`,
        to: `${email}`,
        subject:`${subject}`,
        html:`${text}`
    }, function(error,info){
        if(error){
            console.log(error);
        } else {
            console.log('Email sent: '+ info.response);
        }
    })
}
module.exports = {
    register: async (req,res,next)=>{//reg model
        const {valid}= await isEmailValid(req.body.email)
        if (!valid){
            return res.status(400).send({
                message:"Please provide a valid email address",
            })
        }
        try {
            //gen activation code
            const characters=
            "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let activationCode = "";
            for (let i = 0; i<= 6; i++){
                activationCode+=
                characters[Math.floor(Math.random()*characters.length)];
            }
            //acc creation
            db.query(`SELECT * FROM users WHERE LOWER(useremail) = LOWER(${db.escape(req.body.email)});`,(err, result)=>{
                if (result.length){return res.status(409).send({msg:'This user is already in use!'});}
                else {
                    bcrypt.hash(req.body.password, 10, (err,hash)=>{
                        if (err){
                            return res.status(500).send({
                                msg:err
                            });
                        } else {
                            //case : password is hashed and now it's to be added to db
                            db.query(`INSERT INTO users set username='${req.body.username}', email=${db.escape(req.body.email)}, password=${db.escape(hash)},validationCode=${db.escape(activationCode)},activationStatus=0`,(err,result)=>{
                                if (err){
                                    return res.status(400).send(err)
                                }
                                send(`<h1> Confirmation of your Registration </h1>
                                <h2>welcome to my barebones page</h2>
                                <p>Please enter the code below to activate your account :<p>
                                <a>Your secret code is: "${activationCode}", do not share it with anyone!</a>`,req.body.email,'activation code')
                                return res.status(201).send({
                                    msg: 'user has been registered'
                                });
                            });

                        }
                    });
                } 
            })
        }catch (error) {console.log(error);
            res.status(400).send("fatal error");
        }
    },
    
}