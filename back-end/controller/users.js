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
        }
    }
}