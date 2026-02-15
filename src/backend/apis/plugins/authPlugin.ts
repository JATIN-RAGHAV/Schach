import { errorPlugin } from "./errorPlugin";
import JWT from "../../helper/jwt";
import { type JWT_PAYLOAD } from "../../interfaces/jwt_payload";

const authPlugin = errorPlugin
.resolve(async ({ headers})=>{
        if(headers == undefined){
                throw new Error("Headers are absent.");
        }

        const token = headers['authorization']?.split(' ')[1]
        if(!token){
                throw new Error("No auth Token given in the headers.")
        }
        const res:JWT_PAYLOAD = await JWT.verify(token)
        return {
                user:{...res}
        }
})

export default authPlugin;
