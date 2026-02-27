import { color as colors } from "../interfaces/enums";
import { type moveSocketResponse ,gameOverReasons, moveSocketRequest} from "../interfaces/game";

export const runGame = (game:string[],delay:number) => {
    const Gintoki = new WebSocket('ws://localhost:2222/game/run',{
        headers:{
            authorization:'Bearer eyJhbGciOiJSUzI1NiJ9.eyJwYXlsb2FkIjp7InVzZXJuYW1lIjoiR2ludG9raSIsInVzZXJJZCI6MX19.m9Wh0RnKsmVv6O0bc3vOdk1Zmoq_nZkspHNCfxmS0sAkp4l9YqXvK7VYme-RDw35zvlx0-CWnlVG69R1pRakyFq_fp-bELNTTUPrIsm6QeXF1T77mJKEyXc0NMO4aJ4-_zgk8842YyIYKp2cpoAyrsvqyCusv10rc0lFkRKDh-WHN08UTlu32uXSJidpD8OR_ofswNu1IE0W4NREMG_AAlxlQNiA1aFxDQS-YhaRtU8oiBzOYH3x0qIfCPvO3dANifYOxJq8j58xtOfAgKf7WltvrG200FGbEee-EPrBr3SKhmsl6iGPuK0CKXOomwpjMkO1tqDxvkSweU4GznWyVA',
            color:colors.Random,
            time:600000,
            increment:0,
        }
    });

    const Kakashi = new WebSocket('ws://localhost:2222/game/run',{
        headers:{
            authorization:'Bearer eyJhbGciOiJSUzI1NiJ9.eyJwYXlsb2FkIjp7InVzZXJuYW1lIjoia2FrYXNoaSIsInVzZXJJZCI6Mn19.RDI209wxErqHGqDiWihILzBwisEAOpb2c4nIsc6_-sy6Zr-Fnb56elc-Ssq4pRAJCM-JRDjseaLOqoSuDA5r2sZzmgYSHcd3QQCSQ-WNImUfSlEPvaZAG-5VikJq6EisDxTH7AAkqAR01tGHUpqLcxEUuakHE7edIjkGwHEEXkem1LssxaxVh9CS5Idr_WIPLce0p9wXWIuLR3fZZqOU_3krdpH2BM8LanfXhuuhJgMfr-STcuxKF3lyein52yc9MokTaTlJzmJe9_u9CUqoLt1_V9fB34A4kMhQXbazyFTV7xVBuvozpl58p28QIv5n3Uo97ixv23jyanTX0gmeTA',
            color:colors.Random,
            time:600000,
            increment:0,
        }
    })
    let start = 0;
    Gintoki.onopen = () => {
        console.log("connection made by gintoki")
        start++;
    }

    Kakashi.onopen = () => {
        console.log("connection made by Kakashi")
        start++;
    }


    let firstGintoki = true;
    let firstKakashi = true;
    interface start{
        start:boolean,
        color:colors
    }

    let moveNumber = 0;
    let gintoki = true; // gintoki is white, kakashi is black

    Gintoki.onmessage = async(m) => {
        if(firstGintoki){
            const parsed = JSON.parse(m.data) as start;
            if(parsed.color == colors.Black){
                gintoki = false;
            }
            else{
                await new Promise(resolve => setTimeout(resolve,delay));
                const request:moveSocketRequest= {
                    move:game[moveNumber++] as string,
                    isMessage:false,
                }
                Gintoki.send(JSON.stringify(request));
                gintoki = false;
            }
            firstGintoki = false;
        }
        else{
            const parsed = JSON.parse(m.data) as moveSocketResponse;
            if(gintoki && moveNumber < game.length){
                await new Promise(resolve => setTimeout(resolve,delay));
                const request:moveSocketRequest= {
                    move:game[moveNumber++] as string,
                    isMessage:false,
                }
                Gintoki.send(JSON.stringify(request));
                gintoki = false;
            }
            else{
                printMoveResponse(parsed,moveNumber,'Gintoki')
            }
        }
    }

    Kakashi.onmessage = async(m) => {
        if(firstKakashi){
            const parsed = JSON.parse(m.data) as start;
            if(parsed.color == colors.White){
                await new Promise(resolve => setTimeout(resolve,delay));
                const request:moveSocketRequest= {
                    move:game[moveNumber++] as string,
                    isMessage:false,
                }
                Kakashi.send(JSON.stringify(request));
                gintoki = true;
            }
            firstKakashi = false;
        }
        else{
            const parsed = JSON.parse(m.data) as moveSocketResponse;
            if(!gintoki && moveNumber < game.length){
                await new Promise(resolve => setTimeout(resolve,delay));
                const request:moveSocketRequest= {
                    move:game[moveNumber++] as string,
                    isMessage:false,
                }
                Kakashi.send(JSON.stringify(request));
                gintoki = true;
            }
            else{
                printMoveResponse(parsed,moveNumber,'Kakashi')
            }
        }
    }
}

// error:boolean,
// message:string,
// over:boolean,
// whyOver:gameOverReasons
// winner:boolean,// The winner gets true and the un-winner gets false
// move:string,
// whiteTimeLeft:number,
// blackTimeLeft:number,
const printMoveResponse = (response:moveSocketResponse,moveNumber:number,player:string) => {
    console.log(`Move made by: ${player}`);
    console.log(`Move Number: ${Math.ceil((moveNumber+1)/2)}`);
    console.log(`Message: ${response.message}`);
    console.log(`over : ${response.over}`);
    console.log(`move : ${response.move}`);
    console.log(`whiteTimeLeft : ${response.whiteTimeLeft}`);
    console.log(`blackTimeLeft : ${response.blackTimeLeft}`);
    console.log(`Why Over: ${gameOverReasons[response.whyOver]}`);
    console.log()
    console.log()
}
