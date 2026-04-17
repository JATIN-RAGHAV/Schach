import Elysia from "elysia";
import "./plugins/authPlugin";
import { authHeaderPlugin } from "./plugins/authPlugin";

export const userData = new Elysia({prefix:"/user"}).use(authHeaderPlugin).get('/me', ({user}) => {
    console.log("got to /users/me")
    return {
        username:user.username,
        userId:user.userId
    }
});
