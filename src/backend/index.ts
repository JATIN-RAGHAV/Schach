import Data from "./database/database";

console.log("Database setup")

console.log(await Data.add("kakashi","ONEPIECE"))
console.log("data setup")

const res = await Data.get("kakashi");
res.forEach(row => {
        console.log(row)
})

Data.end();
