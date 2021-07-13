import React from 'react';
import "./register.css";
import RoomIcon from '@material-ui/icons/Room';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import CancelIcon from '@material-ui/icons/Cancel';
const Register = ({setShowRegister}) =>{

    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
            
        }

        try {
            const res = await axios.post('/users/register',newUser);
            setError(false);
            setSuccess(true);
        } catch (error) {
            console.log(error)
            setSuccess(false);
            setError(true)
        }
    }
    return(
        <div className="registerContainer">
            <div className="logo">
                <RoomIcon/>LamaPin
            </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="username" ref={nameRef}/>
                    <input type="email" placeholder="email" ref={emailRef}/>
                    <input type="password" placeholder="password" ref={passwordRef}/>
                    <button className="registerbtn">Register</button>
                    {success && <span className="success">Successfull.You can login now!</span>}
                    {error &&  <span className="fail">Something went wrong!</span>}
                   
                </form>

           <CancelIcon className="registerCancel" onClick={()=>setShowRegister(false)}></CancelIcon>
        </div>
    )
}

export default Register