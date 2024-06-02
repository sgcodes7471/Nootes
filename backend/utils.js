import jwt from 'jsonwebtoken'
const authToken = (req , res , next)=>{

    const authHeader = req.headers["authorization"];
    //set the header as key=authorization and value=Bearer <Token>
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) 
        return res.sendStatus(401).json({
    "error":true,
    "message":"Access Token Verification fail"
    });
    jwt.verify(token , process.env.ACCESS_TOKEN_SECRET , (error , user)=>{
        if(error)
            return res.sendStatus(401).json({
                "error":true,
                "message":"Access Token Verification fail"
                });
        req.user=user;
        next();
    })
}



import { User } from './models/userModel.js'
const generateAccessToken=async (userId)=>{
    try{
        const user=await User.findById(userId)
        const AccessToken= user.generateAccessToken();
        return AccessToken 
    }catch(error){
        console.log("Error in Generating Access Token")
    }
}
const generateRefreshToken=async (userId)=>{
    try{
        const user=await User.findById(userId)
        const RefreshToken=user.generateRefreshToken();
        user.refreshToken=RefreshToken;
        await user.save({validateBeforeSave:false})
        return RefreshToken 
    }catch(error){
        console.log("Error in Generating Refresh Token")
    }
}



import nodemailer from 'nodemailer';
import Redis from 'ioredis'
const otpGeneratorAndMailer = async (userEmail)=>{
    const otp = await userCheck.generateOTP();
    if(!otp){
        return res.status(502).json({
            "error":true,
            "message":"OTP could not be generated due to technical issues"
        })
    }
    const OTPExpireIn = Date.now() + 15*60*1000;
    const redis = new Redis();
    redis.set( `otp:${userEmail}` , otp , 'EX' , 15*60)

    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'official06srinjoy@gmail.com',
            pass:process.env.EMAIL_PASSWORD
        }
    })
    let mailInfo = {
        from:'official06srinjoy@gmail.com' , 
        to:`${userEmail}`,
        text:`Your OTP for Nootes is ${otp}`
    }
    transporter.sendMail(mailInfo , (error , info)=>{
        if(!error){
            console.log(error)
            return res.status(505).json({
                "error":true,
                "message":"Email could not be sent! Please Try Later. Sorry for Incovieniece"
            })
        }
        return res.status(200).json({
            "error":false,
            "message":"OTP sent to your Registered Email Id",
            "OTPExpiry":OTPExpireIn
        })
    })
}

export {authToken , generateAccessToken , generateRefreshToken , otpGeneratorAndMailer};