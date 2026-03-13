import axios from "axios";
import { userCreateZod } from "@/../../common/interfaces/userZodTypes";
import {type userCreatedResponse } from "@/../../common/interfaces/responses";

// Get the base url to make the request
const baseUrl = import.meta.env.VITE_BASE_API_URL

// Takes in the username and password and returns the jwt token
// If userCreated successfully then return true else return false
export const createUser = async (username: string, password: string):Promise<boolean> => {
    const route = "http://" + baseUrl + "/user/create";

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
        return true;
    }
    catch(err){
        return false;
    }
};

// Takes in the username and password and returns the jwt token
// If logged in successfully then returns true else returns false
export const loginUser = async (username: string, password: string):Promise<boolean> => {
    const route = "http://" + baseUrl + "/user/login";

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
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        return true;
    }
    catch(err){
        return false;
    }
}

export const getUserInfo = async ():Promise<{username:string,userId:string}|null>=> {
    const route = "http://" + baseUrl + "/user/me";
    const token = localStorage.getItem("token");
    if(!token){
        return null;
    }
    try{
        const res = await axios.get(route,{headers:{
            Authorization:"Bearer "+ token
        }});
        res.data as {username:string,userId:string};
        return res.data;
    }
    catch(err){
        return null;
    }
}
