import React, {useState} from 'react';
import { MdEmail } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import "./styles/LogIn.css"
import { useNavigate } from 'react-router-dom';

function LogIn(){
    const errorMessage = <div className='error-message'>
                            <p>Invalid Email or Password</p>
                         </div>
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const userData = [{
        email: "ahmshohjahon@gmail.com",
        password: "password123"
    }]

    function handleEmailChange(event){
        setEmail(event.target.value)
    }
    function handlePasswordChange(event){
        setPassword(event.target.value)
    }
    function handleLogin(){
        for (let data of userData){
            if (data.email === email && data.password === password){
                console.log("sorry")
                navigate(('/home'))
                return
            }
            setLoginError(errorMessage)
        }
    }

    return (<>
        <section>
        <div className="login-box">
            <form>
                <h2>Login</h2>
                <div className="input-box">
                    <span className='icon'><MdEmail /></span>
                    <input type="email" required 
                    placeholder=' ' onChange={handleEmailChange}/>
                    <label>Email</label>
                </div>
                <div className="input-box">
                    <span className="icon"><IoLockClosed /></span>
                    <input type="password" required 
                    placeholder=' ' onChange={handlePasswordChange}/>
                    <label>Password</label>
                </div>
                <button type='submit' onClick={handleLogin}>Login</button>
                {loginError}
            </form>
        </div>
        </section>
    </>);
}
export default LogIn