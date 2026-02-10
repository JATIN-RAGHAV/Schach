import Elysia from "elysia";

const App = new Elysia();

App.delete("id/:id",({params:{id}, query:{name}}) => {
        return {
                message:"Take is back",
                id,
                name
        }
})

export default App
