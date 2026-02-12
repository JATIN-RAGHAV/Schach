import Elysia from "elysia";
import JWT from "../helper/jwt";
import { type JWT_PAYLOAD } from "../interfaces/jwt_payload";

const authPlugin = new Elysia({name:"auth"})
        .onBeforeHandle(async ({ headers, status })=>{
                if(headers == undefined){
                        status(401)
                        return{
                                error:true,
                                message:"Bro didn't header, lol"
                        }
                }
                const token = headers['authorization']?.split(' ')[1]
                if(!token){
                        status(401)
                        return{
                                error:true,
                                message:"Auth Token not sent"
                        }
                }
                try{
                        await JWT.verify(token)
                }
                catch (e) {
                        status(401)
                        return {
                                error:true,
                                message:"Wrong token"
                        }
                }
        })
        .resolve(async ({headers}):Promise<{user:JWT_PAYLOAD | null}> => {
                const token = headers['authorization']?.split(' ')[1]
                if(token){
                        const res:JWT_PAYLOAD = await JWT.verify(token)
                        return {user:res}
                }
                return {user:null}
        })

export default authPlugin;
