# Things to get better at:
- Common
- - File Structure
- - Testing
- - Clean Code

- Backend
- - User Input Validation
- - Logic flow

- Frontend
- - State Management
- - CSS
- - Tailwind

# DEVELOPMENT

## Date: 2026-02-25

- [x] Fix Special Moves Flags
- - Update flags function wanted the original board to find the piece which was moved, but the board was being updated before the flagsw, and thus the update flag function was finding an empty square and never registering enpassant or any other special move.
- [x] Board not updating correctly in enpassant
- - Make Move function was not checking for en passant
- [x] Game not saving on Database
- - Because the table name was also going in as a placeholder in the query, which is wrong.
- [x] We getting possible moves which are not possible
- - There was no valid move check for pawn moves when generating possible moves.

### Random Fixes
- En passant was turning out to be invalid, because, the rows were set to [2,5] instead of [3,4] and sRow in [3,4] was being used instead of [3,4].includes(sRow) and getFlags had an object as a key, so changed that to a string, and getFlag returns the flag value, but it was being used to left shif and get the flag.

## Date: 2026-02-26

- Fixed backend bugs and added a test to test out a whole game till the end by connecting to the server using websockets.

## Date: 2026-02-27

- [x] Set up websocket protocol.
- - The frontend needs to send more data to the backend other then simply the moves.
 1. Move -> string eg."e2e4"
 2. Pawn Promotion? -> enum
 3. Resign and draw Offers? -> enum
 4. Message? -> string
 5. IsMessage -> bool

- [x] Intialize frontend architecture.

## Date: 2026-02-28

- [x] Change auth from header to cookie.
- - Can't add cookies because there is no way to add cookie to the https request which is sent to stablish a websocket connection for the tests. And thus tests wont' work for a websocket connetion, which is a bad thing.
- [x] Figure out how to use frontend component libraries and be smart about frontend.
- - Used Shadcn UI, which is a component library built on top of Radix UI and Tailwind CSS, and it is also open source, so we can customize it as we want.

## Date: 2026-03-01

- [x] Added an self made svg.
- [x] Dark Theme / Use CSS variables to change the theme / Use HSLA format
- [x] Compelte Login / Signup.
- [ ] Add Mikhail Tal Depth Map.

## Date: 2026-03-07

### Logs

The game start page takes the time, color and increment and calls a startGame function which returns a websocket and error indicator, if error then socket is null and we stay at the page.
But if no error and we reroute to a loding page which just loads till the server says that it's ok to start a game.
And then we start the game.

- - Changed auth from header to query params, because there is no way to add headers from the frontned when stablishing a websocket connection, and thus we can't add the token to the header, but we can add it to the query params, and then we can get it from the query params in the backend and validate it.
- Components

- - Board
- - - Input
- - - Board
- - - WS Object

- - - Functionality
- - - Renders the board and the pieces
- - - Allows the player to make a move
- - - Validates the move
- - - Sends the move to the backend using websockets

## Date: 2026-03-08

- Board just display the board object ( which is simply a 2d array of pieces enum ) and there is a map between the piece enum and the piece svg, so we can render the pieces on the board.


## Date: 2026-03-09
- Board has to display the current board.
- Allows user to make a move. ( user can pick up a piece by left click hold and move it around. and put the piece down by releasing left click. then the move is validated and if correct then two things happen)
- - Move is shown on the board.
- - Move is sent to the backend.

- On mouse down
- - For this the event listner can be put on the board since, the piece can only be picked up from the board.
- - The piece clicked should have the same color.
- - Put that piece at mouse location.
- - Hide the piece from the source location.

- On mouse Up
- - The event listener has to be put on the document because, the piece might be droppod off the board. Also the draggable piece comes under the cursor and since it's z index is higher we can't actually click the board or any other element.
- - If piece was being dragged.
- - the current mouse position in inside the board.
- - get the target square and validate the move.
- - If legit move -> update the board. Tell the backend.
- - If not legit move -> put piece back on the original square.
- - remove dragged state and remove piece from cursor.

## Date: 2026-03-11
- - Flip board according to the player's color ( Keep a state variable color )
- - - Added a new state variable at the board page level which is passed to a flip button and the board. And the setter is passed to the flip button only.
- - Add the onMessage handler to the websocket on the start page itself, since adding it later on, on the play page is too late and the message has already been sent by the backend.

## Date: 2026-03-11
- Fix the bugs.

- Persistent Session after reload of page or close of tab for 20 seconds.
- - The backend must change. It must keep a track of all the on going sockets and when a sockect closes while in a game two things happen.
- - - A settime out is set for 20 second and a reference to it is stored in a variable. where the key would be a token given to the palyer at start of the game.And a socket request comes with that token from the same user then. the settimeout is called off. Otherwise it cleans up game state and tells the other user that they won.
- - - We tell the other user that this user is gone and they will see a 20 second timer, and if the gone user comes back then another socket message is sent to this user and they continue the game and remove the timer. Other wise they get a victory message.

- Added sounds to moves.
- If use not logged in then should be redirected to login page.

## Date: 2026-03-12
- Make the UI work fully on frontend.
- - Page navigation.
- - User redirection to login page if not logged in.
