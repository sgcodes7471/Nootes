import {Link} from 'react-router-dom'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './LandingPage.css';
import './LoginPage.css';
import './SignupPage.css';
import './MainPage.css';
import Navbar from './Navbar.js';

function LoginPage(){
    const [username , setUsername]=useState('');
    const [password , setPassword]=useState('');
    const navigate=useNavigate();

    const  handleLogin=async (credentials)=>{
      try{
        const response=await fetch('/LogIn',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },body:JSON.stringify(credentials)
        })
        if(response.status === 200){
            const {AccessToken , loggedInUser} =await response.json();
            localStorage.setItem('AccessToken', AccessToken )
            localStorage.setItem('loggedInUser', loggedInUser )
            navigate(`/LogIn/${loggedInUser._id}`)
        }else{
            alert("Invalid Login Credentials")
        }
      }catch(error){
        console.log(error)
        alert("Error in Logging In User from our side. Please Try Later!! Sorry for Inconviniece")
      }
    }

    return(<>
    <div className='body-wrapper'>
    
    <Navbar/>
  
    <div className='login-form-wrapper'>
  
    <form method='post' action='/LogIn' onSubmit={async (e)=>{
      e.preventDefault();
      handleLogin({username ,  password})
    }}>
      <h2>LogIn</h2>
      <input type='text' name='uniqueUser' placeholder='Enter your email or UserId' onChange={(e)=>setUsername(e.target.value)} required/>
      <input type='password' name='password' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} required/>
      <input className='login-submit' type='submit' value="LogIn"/>
    </form>
  
      <div className='login-extras-wrapper'>
      <p><Link to='/ForgotPassword'></Link></p>
      <p><Link to='/SignUp'>Don't have an Account?</Link></p>
      </div>
  
    </div>
  
    </div>
    </>)
  }

  export default LoginPage 