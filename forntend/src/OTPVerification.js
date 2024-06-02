import { useState } from "react"
import axios from 'axios'
import useNavigate from 'react-router-dom'

const OTPVerfication = ()=>{

    const [username , setUsername]=useState();    
    const [otp , setOtp]=useState();    
    const [newPassword , setNewPassword]=useState();    
    const [confirmPassword , setConfirmPassword]=useState();    

    const verifyOtp= async()=>{

        if(confirmPassword !== newPassword){
            alert("Confirm Password is not same as New Password")
            return;
        }
        
        const response = await axios.post('/ForgotPassword/OTPVerfication' , {
            newPassword:newPassword, username:username , OTP:otp
        })
        const navigate = useNavigate();
        if(!response){
            alert("Some Error Occured!")
            return;
        }
        const data=await response.json();
        alert(data.message)
        if(!data.error){
            navigate('/LogIn' , {replace:true})
        }
    }

    return(<>
        <div className="signup-form-wrapper">

            <form action="/ForgotPassword/OTPVerfication" onSubmit={(e)=>{
                e.preventDefault();
                verifyOtp();
            }}>
                <h2>Enter Your 4-Digit OTP here:</h2>
                <input type="text" name='otp' onChange={(e)=>setOtp(e.target.value)}  required/>
                <input type="text" name='username' onChange={(e)=>setUsername(e.target.value)}  required/>
                <input type="password" name='password' onChange={(e)=>setNewPassword(e.target.value)}  required/>
                <input type="password" name='ConfirmPassword' onChange={(e)=>setConfirmPassword(e.target.value)} required/>
                <input className="login-submit" type="submit" value='Change Password'/>
            </form>
        </div>
    </>)
}

export default OTPVerfication