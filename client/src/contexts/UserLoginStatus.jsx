import { userLoginContext } from "./UserLoginContext";
import { useState } from "react";

function UserLoginStatus({children}){
    let [currentUser, setCurrentUser] = useState({})
    let [loginStatus, setLoginStatus] = useState(false)
    let [token,setToken]=useState("")
    let [error, setError] = useState("")


    async function onLogin(userCredentials) {
        try {
            let res = await fetch('https://dishcovery-j22s.onrender.com/user-api/login', {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(userCredentials)
            });
    
            let result = await res.json();
    
            if (result.message === "login success") {
                sessionStorage.setItem("token", result.token);
                setToken(result.token);
                setLoginStatus(true);
                setError("");
    
                // Ensure preferences are set
                const updatedUser = {
                    ...result.user,
                    preferences: result.user.preferences || {} 
                };
    
                setCurrentUser(updatedUser);
            } else {
                setError(result.message);
                setCurrentUser({});
                setLoginStatus(false);
            }
        } catch (err) {
            setError(err.message);
        }
    }
    
    

    function onLogout() {
        setCurrentUser(null)
        setLoginStatus(false)
        setError('')
        sessionStorage.removeItem('token')
        setToken('')
    }


    return(
        <userLoginContext.Provider
        value = {{onLogin, onLogout, loginStatus, error, currentUser, setCurrentUser,token,setToken}}>
            {children}
        </userLoginContext.Provider>
    )

}

export default UserLoginStatus;