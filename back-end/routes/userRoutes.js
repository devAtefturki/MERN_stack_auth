const express= require ('express')
const router=express.Router()
const {register, getUser, login, logout, verifyCode, modifyPass}=require("../controller/users")



router.post('/register',register)
router.post('/verify',verifyCode)
router.post('/login',login)
router.get('/logout',logout)
router.get('/getUser',getUser)
router.put('/updatePass',modifyPass)


module.exports =router