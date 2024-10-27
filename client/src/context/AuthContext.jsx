import {createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utilities/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [regError, setRegError] = useState(null)
    const [isRegLoading, setIsRegLoading] = useState(false)
    const [regInfo, setRegInfo] = useState({
        name : "",
        email : "",
        password : "",
    })

    useEffect(() => {
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    },[])

    const updateRegInfo = useCallback((info) => {
        setRegInfo(info);
    },[]);

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    },[]);


    //register User
    const registerUser = useCallback(async(e) => {
        //to avoid refreshing the page on register
        e.preventDefault();

        setIsRegLoading(true)
        setRegError(null)

        const response = await postRequest(
            `${baseUrl}/users/register`,
            JSON.stringify(regInfo),            
        );

        setIsRegLoading(false);

        if(response.error){
            return setRegError(response);
        }
        //store in local storage
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    },[regInfo])
    

    //login User
    const [loginInfo, setLoginInfo] = useState({
        email : "",
        password : "",
    })
    const [loginError, setLoginError] = useState(null)
    const [isLoginLoading, setIsLoginLoading] = useState(false)

    const loginUser = useCallback(async(e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        
        const response = await postRequest(
            `${baseUrl}/users/login`,
            JSON.stringify(loginInfo),
        );

        setIsLoginLoading(false);

        if(response.error){
            return setLoginError(response);
        }
        //store in local storage
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    },[loginInfo])


    //logout User
    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    })

    return <AuthContext.Provider value={{
        user,
        regInfo,
        updateRegInfo,
        registerUser,
        regError,
        isRegLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        isLoginLoading,
        updateLoginInfo
    }}>
        {children}
    </AuthContext.Provider>
}