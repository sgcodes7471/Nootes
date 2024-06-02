

import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            lowercase:true,
            unique:true
        },
        fullname:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        refreshToken:{
            type:String
        }
    },{
        timestamps:true
    }
)

userSchema.pre("save", async function (next){
    if(!(this.isModified("password")))
        return next();
    this.password=await bcrypt.hash(this.password, 10);
    next()
} )

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken=function(){
 try{
    return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.fullname,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }catch(error){
    console.log("Error in Signing of Access Token")
    throw error;
 }
}

userSchema.methods.generateRefreshToken=function(){
  try{
    return  jwt.sign(
        {
            _id:this._id
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
  }catch(error){
    console.log("Error in signing of Refresh Token")
    throw error
  }
}

userSchema.methods.generateOTP = function (){
    try{
        const otp = parseInt(crypto.randomBytes(4).toString('hex').slice( 0 , 4) , 16).toString().slice(0 , 4)
        return otp;
        
    }catch(error){
        console.log("Error is generating OTP")
        throw error
    }
}

export const User=mongoose.model("User"  , userSchema);