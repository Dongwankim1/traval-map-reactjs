import axios from 'axios';
import React, { useRef, useState } from 'react';
import RoomIcon from '@material-ui/icons/Room';
import CancelIcon from '@material-ui/icons/Cancel';
import './login.css';
const Login = ({setShowLogin,myStorage,setCurrentUser}) =>{

    const [error,setError] = useState(false);

    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const user = {
            username:nameRef.current.value,
            password:passwordRef.current.value,
            
        }

        try {
            const res = await axios.post('/users/login',user);
            myStorage.setItem("user",res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);

        } catch (error) {
            console.log(error)

            setError(true)
        }
    }

    return ( <div className="loginContainer">
    <div className="logo">
        <RoomIcon/>LamaPin
    </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="loginbtn">login</button>
            {error &&  <span className="fail">Something went wrong!</span>}
           
        </form>

   <CancelIcon className="loginCancel" onClick={()=>setShowLogin(false)}></CancelIcon>
</div>)
}

export default Login;