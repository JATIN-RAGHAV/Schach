import Elysia from "elysia";
import { access } from "./access";
import { verify } from "../helper/jwt";
import {App as StartGame} from "./startGame.ts"
import type { JWT_PAYLOAD } from "../interfaces/jwt_payload.ts";

let router = new Elysia();

router.use(access)
        .use(StartGame)

router.guard({
        async beforeHandle({ headers, status }){
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
                        await verify(token)
                }
                catch (e) {
                        status(401)
                        return {
                                error:true,
                                message:"Wrong token"
                        }
                }
        }},app => {
                return app
                        .resolve(async ({headers}) => {
                                const token = headers['Authorization']?.split(' ')[1]
                                if(token){
                                        const res:JWT_PAYLOAD = await verify(token)
                                        return {user:res}
                                }
                        })
        })

export default router
