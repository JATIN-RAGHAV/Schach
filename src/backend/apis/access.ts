import Elysia from "elysia";
import Data from "../database/database";
import { sign } from "../helper/jwt";
import { userCreateZod } from "../interfaces/zod_types";

export const access = new Elysia();

access.post('/user/create', async ({body}) => {
        const res = userCreateZod.safeParse(body);
        if(!res.success){
                return{
                        error:true,
                        message:[...JSON.parse(res.error.message)]
                        
                }
        }
        try{
                const {username,pass} = res.data;
                const payload = await Data.createUser(username,pass);
                const token = await sign(payload)
                return {
                        error:false,
                        token:token
                }
        }
        catch (e){
                return{
                        error:true,
                        message:e
                }
        }
})

access.post('/user/login',async({body})=>{
        const res = userCreateZod.safeParse(body)
        if(!res.success){
                return{
                        error:true,
                        message:[...JSON.parse(res.error.message)]
                        
                }
        }
        try{
                const {username,pass} = res.data;
                const payload = await Data.verifyUser(username,pass);
                const token = await sign(payload)
                return {
                        error:false,
                        token:token
                }
        }
        catch (e){
                return{
                        error:true,
                        message:e
                }
        }
})
