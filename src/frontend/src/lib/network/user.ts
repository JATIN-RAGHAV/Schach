import axios from "axios";
import { userCreateZod } from "@/../../common/interfaces/userZodTypes";

// Get the base url to make the request
const baseUrl = import.meta.env.VITE_BASE_API_URL

// Takes in the username and password and returns the jwt token
export const createUser = async (username: string, password: string) => {
    const route = baseUrl + "/user/create";
    const payload = userCreateZod.safeParse({
        username,
        password
    })

    if(!payload.success){
        return {
            error:payload.error,
        };
    }

    const res = await axios.post(route, 
        { username, password }
    )
    return res;
};

// Takes in the username and password and returns the jwt token
export const loginUser = async (username: string, password: string) => {
    const route = baseUrl + "/user/login";
    const res = await axios.post(route, 
        { username, password }
    )
    return res;
}
