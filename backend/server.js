
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { User } from './models/userModel.js'
import { Notes } from './models/notesModel.js';
import {authToken , generateAccessToken , generateRefreshToken , otpGeneratorAndMailer} from './utils.js';
import Redis from 'ioredis'

const app=express()


import cors from 'cors';
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true , limit:"16kb"}));

import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname , 'build')));


import cookieParser from 'cookie-parser'
app.use(cookieParser());

//Rendering of Get Request Pages
app.get('/' , (req, res)=>{
    res.sendFile(path.join(__dirname , 'build/index.html'));
})
app.get('/SignUp' , (req, res)=>{
    res.sendFile(path.join(__dirname , 'build/index.html'));
})
app.get('/LogIn' , (req, res)=>{
    res.sendFile(path.join(__dirname , 'build/index.html'));
})
app.get('/ForgotPassword' , (req, res)=>{
    res.sendFile(path.join(__dirname , 'build/index.html'));
})



//SignUp working Well!
app.post('/SignUp' ,async (req, res)=>{
    const fullname = req.body.fullname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    if(password.length <8){
        return res.status(409).json({
            user:null,
            "error":true,
            "message":"Password must be at least 8 characters long"
        })
    }

    const userExistenceCheck =await User.findOne({$or:[{email:email} , {username:username}]})
    if(!(userExistenceCheck == null) && (userExistenceCheck.email==email || userExistenceCheck.username==username)){
        return res.status(409).json({
            user:null,
            "error":true,
            "message":"User with same email or username already exists! Choose something Different"
        })
        
    }
    const newUser=await User.create({fullname ,  username , email , password})
    if(newUser==null){
       return res.status(501).json({
            user:null,
            "error":true,
            "message":"Problem in Creating a User.Sorry!"
        })
    }
    return res.status(200).json({
        user:newUser,
        "error_status":false,
        "message":"Succesfully created account. GO LOG IN!!!!"
    });
})


//LogIn working Well!
app.post('/LogIn' , async (req, res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const userExistenceCheck=await User.findOne( {username:username} );
    if(!userExistenceCheck){
        console.log("User Does not exist!!");
       return  res.status(404).json({
            user:null,
            "error":"User Does not Exist!! Give a Valid Username"
        })
    }
    const user=userExistenceCheck;
    const passwordCheck=await user.isPasswordCorrect(password)
    if(!passwordCheck){
        console.log("Password is Incorrect")
       return  res.status(404).json({
            user:null,
            "error":"Incorrect Password"
        })
    }
    const AccessToken = await generateAccessToken(user._id);
    const RefreshToken = await generateRefreshToken(user._id);
    const loggedInUser=await User.findById(user._id).select(" -password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("AccessToken", AccessToken, options).cookie("RefreshToken" , RefreshToken, options).
    json({
        "error":false,
        "loggedInUser":loggedInUser, 
        "AccessToken":AccessToken , 
        "RefreshToken":RefreshToken
    });
})


//This one working Well!
app.get('/LogIn/:id' , authToken , async (req , res)=>{
    const user=req.user
    //you get this user from the authToken()
    try{
        const userCheck = await User.findById(user._id).select("-password -refreshToken")
        const notesCheck = await Notes.find({userId : user._id})
        if(!userCheck)
            return res.status(404).json({
        "error":true,
        "message":"User Not Found"
        })
        if(!notesCheck)
            return res.status(404).json({
        "error":true,
        "message":"Notes Not Found"
        })
        return res.status(200).json({
            "error":false,
            "message":"All Notes displayed Successfully",
            "user":userCheck,
            "notesList":notesCheck
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Notes not found due to technical/server issues"
        })
    }
})


//testing not done
app.post('/ForgotPassword' , async (req, res) => {
   
try{
    const username = req.username ; 
    const userCheck = await User.find({username : username});
    if(!userCheck){
        return res.status(401).json({
            "error":true,
            "message":"Username not found! Try Different username"
        })
    }
    otpGeneratorAndMailer(userCheck.email)
}catch(error){
    console.log(error);
    return res.status(505).json({
        "error":true,
        "message":"Password Retrieval Mail could not be sent! Please Try Later. Sorry for Incovieniece "
    })
}
})


//testing not done
app.post('/ForgotPassword/OTPVerfication' , async (req, res)=>{
    try{
        const  {newPassword, username , OTP} = req.body;
    const user=await User.findOne({username : username})
    if(!user){
        return res.status(401).json({
            "error":true,
            "message":"Invalid Username"
        })
    }
    const redis = new Redis();
    redis.get( `otp:${userEmail}`).then(response => {
       if(response !== OTP){
        return res.status(401).json({
            "error":true,
            "message":"Incorrect OTP"
        })
       }
       user.password = newPassword;
       user.save({validateBeforeSave:false})
       return res.status(200).json({
        "error":false,
        "message":"Password Updated Successfully! GO and LOGIN"
       })
    })
    }catch(error){
        return res.status(505).json({
            "error":true,
            "message":"Some Error Occured while changing password! Please Try Later. Sorry for Incovieniece "
        })
    }
})


//testing not done
app.post('/LogOut/:id' , authToken  , async (req, res)=>{
    const user = req.user;
    const AccessToken=req.AccessToken;
    try{
          return  res.status(200).clearCookie('AccessToken').json({
            "error":false,
            "message":"User Logged Out Successfully"
        })
    }catch(error){
      return  res.status(500).json({
            "error":true,
            "message":"Error in Server while logging Out the user"
        })
    }
})


//add-Note working Well!
app.post('/LogIn/:id/add-Note' , authToken ,  async (req, res)=>{
    const {heading , id , content} = req.body;
    const user = req.user;
    try{
        const newNote = await Notes.create({
         heading , id , content , userId : user 
        })
        return res.status(200).json({
            "newNote":newNote,
            "error":false,
            "message":"New Note Successfully Added"
        })
    }catch(error){
       return  res.status(501).json({
            "error":true,
            "message":"Could not create a New Note due to technical issues"
        })
    }
})


//if I am sending a add-note request with a access token that belongs to some other user but is valid then also the note is added but to the user to whom the access token origially belongs
//this although won't cause a problem i guess as the users will never get Access token of each other


//edit-Note working Well!
app.put('/LogIn/:id/edit-Note/:noteId' , authToken , async (req, res)=>{
    const noteId = req.params.noteId;
    const {heading , content}=req.body
    const user=req.user
    if(!heading && !content){
        return res.status(409).json({
            "error":true,
            "message":"Empty informations for the note",
            "note-id":noteId
        })
    }
    try{
        const noteCheck = await Notes.findOne({_id:noteId , userId:user._id} )
        if(noteCheck == null){
            return res.status(404).json({
                "error":true,
                "message":"Note not Found"
            })
        }
        const noteEdit=noteCheck;
        if(noteEdit.heading==heading && noteEdit.content==content){
            return res.status(400).json({
                "error":true,
                "message":"No Changes Made to the existing note"
            })
        }
        if(noteEdit.heading!=heading)
                noteEdit.heading=heading
        if(noteEdit.content!=content)
                noteEdit.content=content
        await noteEdit.save()
        return res.status(200).json({
            "error":false,
            "message":"Note Edited Successfully",
            "edited-note":noteEdit
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            "error":true,
            "message":"Changes to the note could not be saved due to technical issues, Please Try Later! Sorry for Inconvinience"
        })
    }
}) 


//del-Note working Well!
app.delete('/LogIn/:id/del-Note/:noteId' ,  authToken  , async (req, res)=>{
    const user=req.user;
    const noteId = req.params.noteId

    try{
       const noteToBeDel= await Notes.findOneAndDelete({ userId : user._id , _id : noteId})
       if(!noteToBeDel){
        return res.status(404).json({
            "error":"Not not found",
            "note-id":noteId,
            "user":user.username
        })
       }
        res.status(200).json({
            "error":false,
            "message":"Note Deleted Successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            "error":true,
            "message":"Could not delete Note due to technical issues"
        })
    }
})



//Connecting to Database and Listening
import mongoose from 'mongoose';
const mongooseConnect=async ()=>{
    try{
        const connectionResponse=await mongoose.connect("mongodb+srv://Srinjoy:Degea1ramos4ronaldo7messi10@cluster0.n5osmkt.mongodb.net/Nootes");
        console.log("MONGO DB Connected Successfully");
    }catch(error){
        console.log("Error in connecting to Database Server");
    }
}
mongooseConnect().then(()=>{
    app.on("error" , (error)=>{
        console.log("Error Ocuured!\n");
        console.log(error);
        throw error;
    })
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log("You are listening");
    })
}).catch(error=>{
    console.log("MongoDB Connection failed, Could not listen the app\n")
    console.log(error);
})

