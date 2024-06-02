import { useState } from "react";
import axios from 'axios'
import useNavigate from 'react-router-dom'
const ForgotPassword= ()=>{

    const [username , setUsername]=useState();    

    const forgotPassword=async ()=>{
        const response = await axios.post('/ForgotPassword' , {username : username})
        const data = await response.json()
        alert(data.message)
        if(!data.error){
            const navigate = useNavigate();
            navigate('/OTPVerfication')
        }

    }

    return (<>
    <div className="signup-form-wrapper" > 
    <form action="/ForgotPassword" onSubmit={async (e) =>{
        e.preventDefault();
        forgotPassword();
    }}>
    <input type='text' name='uniqueUser' placeholder='Enter your email or UserId' onChange={(e)=>setUsername(e.target.value)} required/>
    <input className='login-submit' type='submit' value="SignUP" />
    </form>
    </div>
    </>)
}

export default ForgotPassword