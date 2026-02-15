Right now server has a way for users to create accounts and login.
There are also a Elysia plugin for authenticated routes and another plugin for websocket connection.
The websocket connection between a user and the server is pretty cool.
It sends back error if proper header is not provided.
And also loops holes like, a single user starting multiple games at the same time can't happen.
And when a user closes their connection in waiting queue the list of connections is updated.

Taks: Write a function that handles a game in memory and then stores it when the game ends.
