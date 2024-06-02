import {Link} from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import './LandingPage.css';
import './LoginPage.css';
import './SignupPage.css';
import './MainPage.css';
import Navbar from './Navbar.js';

function SignupPage(){
  const [username , setUsername]=useState("");
  const [fullname , setFullname]=useState("");
  const [email , setEmail]=useState("");
  const [password , setPassword]=useState("");
  const [confirmPassword , setConfirmPassword]=useState("");


  const signup = async ()=>{
    if([fullname.trim() , username.trim() , email.trim() , password.trim()].some(detail => detail==="")){
      alert("All Fields are necesary");
  }
    if(password.length < 8){
      alert("Password must have atleast 8 characters")
    }
    if(password !== confirmPassword)
        alert("Confirm Password is not same as Password")

    try{
      const response=await axios.post('/SignUp' , {fullname , username ,  email , password})
      const data =await response.json()
      alert(data.message)
    }catch(error){
      alert("Error in Creating User from our side. Please Try Later!! Sorry for Inconviniece");
    }
  }

    return(<>
    <div className='body-wrapper'>
      <Navbar/>
      <div className='signup-form-wrapper'>
  
    <form action='/SignUp' method='post' onSubmit={(e)=>{
      e.preventDefault();
     signup();
      
    }}>
      <h2>SignUp</h2>
      <input type='text' name='fullname' placeholder='Enter your Full Name' onChange={(e)=>setFullname(e.target.value)} required/>
      <input type='text' name='userId' placeholder='Enter a UserId' onChange={(e)=>setUsername(e.target.value)} required/>
      <input type='text' name='email' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} required/>
      <input type='password' name='password' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}  required/>
      <input type='password' name='conf_password' placeholder='Confirm your password' onChange={(e)=>setConfirmPassword(e.target.value)} required/>
      <input className='login-submit' type='submit' value="SignUP" />
    </form>
  
    </div>
    <div className='login-extras-wrapper'>
      <p><Link to='/LogIn'>Already have an Account?</Link></p>
      </div>
    </div>
    </>)
  }

  export default SignupPage;