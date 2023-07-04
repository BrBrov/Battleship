# Battleship
Websocket battleship server tasck for RSSchool

Assignment: Websocket battleship server
Description
Your task is to implement battleship game backend using websocket.

The backend should be able to do the following:

Start websocket server
Handle websocket connection
Handle player requests
Handle room requests
Handle ships requests
Handle game requests
Create single play bot (optional)
Technical requirements
Task can be implemented on Javascript or Typescript
Use 18 LTS version of Node.js
Only ws, cross-env, typescript, ts-node, ts-node-dev, nodemon, dotenv, eslint and its plugins, webpack and its plugins, prettier, @types/* and testing tools (for example, Jest, Mocha, AVA, Jasmine, Cypress, Storybook, Puppeteer) are allowed
The program is started by npm script start in following way:
All requests and responses must be sent as JSON string
npm run start
After starting the program displays websocket parameters
After program work finished the program should end websocket work correctly
After each received command program should display the command and result
The backend should have 3 types of response:
personal response
reg - player registration/login
response for the game room
create_game - game id and enemy id
start_game - informationa about game and player's ships positions
turn - who is shooting now
attack - coordinates of shot and status
finish - id of the winner
response for all
update_room - list of rooms and players in rooms
update_winners - send score table to players
Game description
We should have inmemory DB with player data (login and password) storage
Player can create game room or connect to the game room after login
Player room data (players, game board, ships positions) storages in the server
Game starts after 2 players are connected to the room and sent ships positions to the server
Server sends move order
Players should shoot in their's turn
Server send back shot result
If player hits or kills the ship, player should make one more shoot
Player wins if he have killed all enemies ships
List of websocket commands (requests/responses) and their syntax (<- - cmd from frontend, -> - answer):
Player
Login or create player
<-
{
    type: "reg",
    data:
        {
            name: <string>,
            password: <string>,
        },
    id: 0,
}
->
{
    type: "reg",
    data:
        {
            name: <string>,
            index: <number>,
            error: <bool>,
            errorText: <string>,
        },
    id: 0,
}
Update winners
->
{
    type: "update_winners",
    data:
        [
            {
                name: <string>,
                wins: <number>,
            }
        ],
    id: 0,
}
Room
Create new room
<-
{
    type: "create_room",
    data: "",
    id: 0,
}
Add player to room
<-
{
    type: "add_player_to_room",
    data:
        {
            indexRoom: <number>,
        },
    id: 0,
}
->
{
    type: "create_game",
    data:
        {
            idGame: <number>,
            idPlayer: <number>,
        },
    id: 0,
}
Update room state
->
{
    type: "update_room",
    data:
        {
            [
                {
                    roomId: <number>,
                    roomUsers:
                        {
                            name: <string>,
                            index: <number>,
                        },
                },
            ]
        },
    id: 0,
}
Ships
Add ships to the game board
<-
{
    type: "add_ships",
    data:
        {
            gameId: <number>,
            ships:
                [
                    {
                        position: {
                            x: <number>,
                            y: <number>,
                        },
                        direction: <boolean>,
                        length: <number>,
                        type: "small"|"medium"|"large"|"huge",
                    }
                ],
            indexPlayer: <number>,
        },
    id: 0,
}
Game
Attack
<-
{
    type: "attack",
    data:
        {
            gameID: <number>,
            x: <number>,
            y: <number>,
            indexPlayer: <number>,
        },
    id: 0,
}
->
{
    type: "attack";,
    data:
        {
            position:
            {
                x: <number>,
                y: <number>,
            },
            currentPlayer: <number>,
            status: "miss"|"killed"|"shot",
        },
    id: 0,
}
Random attack
<-
{
    type: "randomAttack",
    data:
        {
            gameID: <number>,
            indexPlayer: <number>,
        },
    id: 0,
}
Change player's turn
->
{
    type: "turn",
    data:
        {
            currentPlayer: <number>,
        },
    id: 0,
}
Finish game
->
{
    type: "finish",
    data:
        {
            winPlayer: <number>,
        },
    id: 0,
}
