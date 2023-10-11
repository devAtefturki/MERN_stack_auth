require('dotenv').config();
const {check} = require('express-validator')
const bcrypt=require('bcrypt')
const db= require('../database/index')
const jwt= require('jsonwebtoken')
const nodemailer= require('nodemailer');
const emailValidator=require('deep-email-validator')

async function isEmailValid(email){
    return  emailValidator.validate(email) 

}
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type:"login",
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
       const valid= await isEmailValid(req.body.useremail)
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
            db.query(`SELECT * FROM users WHERE LOWER(useremail) = LOWER(${db.escape(req.body.useremail)});`,(err, result)=>{
                if (result.length){return res.status(409).send({msg:'This user is already in use!'});}
                else {
                    bcrypt.hash(req.body.userpass, 10, (err,hash)=>{
                        if (err){
                            return res.status(500).send({
                                msg:err
                            });
                        } else {
                            //case : password is hashed and now it's to be added to db
                            db.query(`INSERT INTO users set username='${req.body.username}', useremail=${db.escape(req.body.useremail)}, userpass=${db.escape(hash)},validationCode=${db.escape(activationCode)},activationStatus=0`,(err,result)=>{
                                if (err){
                                    return res.status(400).send(err)
                                }
                                send(`<h1> Confirmation of your Registration </h1>
                                <h2>welcome to my barebones page</h2>
                                <p>Please enter the code below to activate your account :<p>
                                <a>Your secret code is: "${activationCode}", do not share it with anyone!</a>`,req.body.useremail,'activation code')
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
  verifyCode: async (req,res)=>{
    try{
        //find user by id
        db.query(`select * from users where useremail=${req.body.useremail}`,(err,result)=>{
            console.log(result,req.body)
            const token = jwt.sign({iduser:result["iduser"]},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '24h'})
            if (result.length&&result[0].validationCode===req.body.ValidatorCode){
                db.query(`update users set activationStatus=1 where useremail='${req.body.useremail}'`,(err,result)=>{
                    err? res.status(500).send(err):
                    res.status(200).cookie('tokenCookie',token,{httpOnly:false,maxAge:24*60*60*1000})//there you go! a cookie with a 24 hour lifespan
                    return res.status(200).send(token)
                });
            }else res.status(402).send("incorrect Code")
        })
    }catch(error){res.status(400).send(error);}
  },
  login: (req,res)=>{
    db.query(
        `SELECT * FROM users WHERE useremail=${db.escape(req.body.useremail)} OR username=${db.escape(req.body.useremail)}`,
        (err,result)=>{
            //case: user does not exist  
            if (err){
                return res.status(400).send({msg: err});
            }
            else if (!result.length){
                return res.status(401).send({
                    msg:'email or password is incorrect'
                });

            }
            else if (result[0].activationStatus===0){res.status(402).send('please activate your account')}
            //password check
            else {bcrypt.compare(req.body.userpass,result[0]['userpass'],(err,result2)=>{
                //case : passwrod is wrong
                if (err){
                    return res.status(401).send({
                        msg:'Email or password is incorrect'
                    });
                }
                if (result2){
                    console.log(result)
                    const token=jwt.sign({iduser:result[0]['iduser']},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'24h'});
                    res.status(200).cookie('tokenCookie',token,{httpOnly:false,maxAge:24*60*60*1000})
                    return res.status(200).send(token);
                }
                return res.status(401).send({
                    msg:'Username or password is incorrect!'
                });
            })}
        }
    )
  },
  getUser:(req,res,next)=>{
    if (
        !req.headers.authorization||
        !req.headers.authorization.startsWith('bearer')||
        !req.headers.authorization.split(' ')[1]
    ){
   //     console.log(!req.headers.authorization||2, "req.heas.auth",
    //        !req.headers.authorization.startsWith('bearer')||2,"req.heads.auth bearer",
    //        !req.headers.authorization.split(' ')[1] || 2,"req.heads.split");
    //        console.log(req.headers.authorization,req.headers.authorization.split(' ')[1])
        return res.status(422).json({
            message:"Please provide token"
        });
    }
    const tokenCookie = req.headers.authorization.split(' ')[1];
    const decoded= jwt.verify(tokenCookie,process.env.ACCESS_TOKEN_SECRET);
    db.query('SELECT * FROM users where iduser=?', decoded.iduser, function (error,results,fields){
        if (error) throw error;
        return res.send({username:results[0].username,iduser:results[0].iduser,useremail:results[0].useremail})
    })
  },
  logout:(req,res)=>{
    res.clearCookie('tokenCookie')
    return res.sendStatus(200)
  },
  modifyPass:(req,res)=>{
    try{
        const hashed=bcrypt.hashSync(req.body.userpass,10,(err,hash)=>{
            console.log(err)
            err? res.status(500).send({msg:err}):hash
        })
        sql=`update users set userpass="${hashed}" where iduser=${req.body.id}`
        db.query(sql,(err,result)=>{
            if (err){
                return res.status(400).send(err)
            }
            else {return res.status(200).json(result)}
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({message: "server error"})
    }
  }

  
}