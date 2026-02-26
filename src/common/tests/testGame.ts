import { color as colors } from "../interfaces/enums";
import { type moveSocketResponse ,gameOverReasons} from "../interfaces/game";

export const runGame = (game:string[],delay:number) => {
    const Gintoki = new WebSocket('ws://localhost:2222/game/run',{
        headers:{
            authorization:'Bearer eyJhbGciOiJSUzI1NiJ9.eyJwYXlsb2FkIjp7InVzZXJuYW1lIjoiR2ludG9raSIsInVzZXJJZCI6Mn19.M24wC5V4AOInsUzhXUyLcIA0doniDb4fsSvlWVjcp8avF4gOxfVz-Bl7waL0EzktQMhBIyVWsexfI15LWxka-SpW7eTbiQvU9EPxhG3UEhqamR0c8PV_ZWPv3K_PpHjwI08tBvB3fu78Ei_hSjQ_KEZcvSHraqN804wl1OozJiIfsxUs1AhbeEIYi3UNIZG842rjj3ZzXyhKjeWYBcMK_rU8EVsy4dQ1zohXb7PIjchfLd9n8b6cgAtLVUPyfaUe5iZHEDSHfqLxMFvQWsLKI79nuD8jn9RNjP5aYWE8LgJg9b9QFFNrIaSxzsBkFyjzE2HNorwHlFi_aqznLj-7uQ',
            color:2,
            time:600000,
            increment:0,
        }
    });

    const Kakashi = new WebSocket('ws://localhost:2222/game/run',{
        headers:{
            authorization:'Bearer eyJhbGciOiJSUzI1NiJ9.eyJwYXlsb2FkIjp7InVzZXJuYW1lIjoia2FrYXNoaSIsInVzZXJJZCI6MX19.XkXzYRFfWtfpmo0wf8LYHW64NsfEiTyxZZfgQVgBg63VscBxeIM8y43NOIwoa_yYSsbuQVpMPIPjxuC32MgNYP7lumV0CdPPfaFDQrig1KwddXGsXnQsUZb6RVUUMO8DJ6gmXh67XcRk3JL2nz9mN4-nElhCkzgx5XLRahUk3bX4QyRxPJlK36kdJzxKAv-xJzSyvRKWPm4j8t2NA6SSpVWTyyg7Wg9CUU0czfsrKgoc3kIqG22nLeoFx8DF9cKjmKr8_lwPOpHxxZKShFOP6zKgYEZmAlo4KJJs2NOr3LYcRQR2oMPPn1Rp-giad1MLrdVO3Vd3GnUWoiY-6ygXbQ',
            color:0,
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
                Gintoki.send(game[moveNumber++] as string);
                gintoki = false;
            }
            firstGintoki = false;
        }
        else{
            const parsed = JSON.parse(m.data) as moveSocketResponse;
            if(gintoki && moveNumber < game.length){
                await new Promise(resolve => setTimeout(resolve,delay));
                Gintoki.send(game[moveNumber++] as string);
                gintoki = false;
                printMoveResponse(parsed,moveNumber,'Kakashi')
            }
        }
    }

    Kakashi.onmessage = async(m) => {
        if(firstKakashi){
            const parsed = JSON.parse(m.data) as start;
            if(parsed.color == colors.White){
                await new Promise(resolve => setTimeout(resolve,delay));
                Kakashi.send(game[moveNumber++] as string);
                gintoki = true;
            }
            firstKakashi = false;
        }
        else{
            const parsed = JSON.parse(m.data) as moveSocketResponse;
            if(!gintoki && moveNumber < game.length){
                await new Promise(resolve => setTimeout(resolve,delay));
                Kakashi.send(game[moveNumber++] as string);
                gintoki = true;
                printMoveResponse(parsed,moveNumber,'Gintoki')
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
