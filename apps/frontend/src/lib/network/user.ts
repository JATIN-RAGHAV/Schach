import axios from "axios";
import { userCreateZod } from "@schach/common/interfaces/userZodTypes";
import {type userCreatedResponse } from "@schach/common/interfaces/responses";
import { useUserState } from "../states/userState";

const baseUrl = import.meta.env.SADAHARU_BACKEND_API_URL
console.log(baseUrl)

// Takes in the username and password and returns the jwt token
// If userCreated successfully then return true else return false
export const createUser = async (username: string, password: string):Promise<boolean> => {
    // Get the base url to make the request
    const route = "https://" + baseUrl + "/user/create";

    // Verify the payload before sending it to the server
    const payload = userCreateZod.safeParse({
        username,
        password
    })

    if(!payload.success){
        return false;
    }

    // Send the request to the server
    try{
        const res = await axios.post(route, 
            { username, password }
        )    
        res.data as userCreatedResponse;
        if(res.data.error){
            return false;
        }
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        const {setUserName} = useUserState.getState();
        setUserName(username);
        return true;
    }
    catch(err){
        return false;
    }
};

// Takes in the username and password and returns the jwt token
// If logged in successfully then returns true else returns false
export const loginUser = async (username: string, password: string):Promise<boolean> => {
    // Get the base url to make the request
    console.log("sending request to create account")
    const route = "http://" + baseUrl + "/user/login";
    console.log("sent request to backend")

    // Verify the payload before sending it to the server
    const payload = userCreateZod.safeParse({
        username,
        password
    })

    if(!payload.success){
        return false;
    }

    // Send the request to the server
    try{
        const res = await axios.post(route, 
            { username, password }
        )    
        console.log("resposen: ",res)
        if(res.data.error){
            throw new Error("Error logging in");
        }
        res.data as userCreatedResponse;
        const { setUserName } = useUserState.getState();
        setUserName(username);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        return true;
    }
    catch(err){
        return false;
    }
}

export const getUserInfo = async ():Promise<{username:string,userId:string}|null>=> {
    // Get the base url to make the request
    const route = "http://" + baseUrl + "/user/me";
    const token = localStorage.getItem("token");
    console.log(token)
    console.log(route)
    if(!token){
        return null;
    }
    try{
        const res = await axios.get(route,{headers:{
            authorization:"Bearer "+ token
        }});
        console.log(res)
        res.data as {username:string,userId:string};
        const { setUserName } = useUserState.getState();
        setUserName(res.data.username);
        return res.data;
    }
    catch(err){
        return null;
    }
}
