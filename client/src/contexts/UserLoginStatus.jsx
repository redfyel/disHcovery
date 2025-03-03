import { userLoginContext } from "./UserLoginContext";
import { useState } from "react";

function UserLoginStatus({children}){
    let [currentUser, setCurrentUser] = useState({})
    let [loginStatus, setLoginStatus] = useState(false)
    let [error, setError] = useState("")


    async function onLogin(userCredentials){
        try{
            let res = await fetch('http://localhost:4000/user-api/login', {
                method : "POST",
                headers : {"Content-type" : "application/json"},
                body : JSON.stringify(userCredentials)
            })
            let result = await res.json()
            console.log(result);

            // user logged in successfully
            if(result.message === "login success"){
                setCurrentUser(result.user)
                setLoginStatus(true)
                setError("")
                sessionStorage.setItem("token", result.token)
            } 
            else {
                setError(result.message)
                setCurrentUser({})
                setLoginStatus(false)
            }
        } catch (err){
            setError(err.message)
        }
    }
    

    function onLogout() {
        setCurrentUser(null)
        setLoginStatus(false)
        setError('')
        sessionStorage.removeItem('token')
    }


    return(
        <userLoginContext.Provider
        value = {{onLogin, onLogout, loginStatus, error, currentUser, setCurrentUser}}>
            {children}
        </userLoginContext.Provider>
    )

}

export default UserLoginStatus;