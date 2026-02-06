import Elysia from "elysia";
const PORT = 2222;
const App = new Elysia()

App.get('/',"Hello there");

App.listen(PORT);
