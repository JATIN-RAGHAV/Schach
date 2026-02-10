import Elysia from "elysia";
import { verify } from "../helper/jwt";

const AuthMiddleware = new Elysia();

AuthMiddleware.onBeforeHandle(async ({headers, set}) => {
        const token = headers['Authorization']?.split(' ')[1]
        if(!token){
                set.status = 401
                return{
                        error:true,
                        message:"Auth Token not sent"
                }
        }

        try{
                await verify(token)
        }
        catch (e) {
                set.status = 401
                return {
                        error:true,
                        message:"Wrong token"
                }
        }
}).derive(async ({headers}) => {
                const token = headers['Authorization']?.split(' ')[1]
                if(token){
                        const res = await verify(token)
                        return {...res}
                }
})

export {
        AuthMiddleware
}
