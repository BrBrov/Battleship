import DataBase from '../../database/database';
import CreateResponse from '../../game/response-message';
import TypesOfData from '../../models/command-types';
import { RegData, User } from '../../models/users-types';
import RoomsBase from '../../database/rooms-base';
import NamedSocket from '../../database/socket-object';
import responseOutput from './response-console';
import UserData from '../../database/user-data';
import Playground from '../../models/game-playground';
import { DataForAddShip, DataForStartGame, DataOfAttackRequset, PalyersTurn } from '../../models/game-types';

export default class Handlers {
  public regHandler(user: User, database: DataBase, socket: NamedSocket): string {

    let result: UserData = database.findUser(user);

    if (!result) {
      result = database.setUser(user, socket);
    }

    if (!database.checkUserForLogin(user)) {
      const err: RegData = {
        name: user.name,
        index: -1,
        error: true,
        errorText: 'Wrong user login or password'
      };
      return new CreateResponse(TypesOfData.REG, JSON.stringify(err), -1).getResponse();
    }

    return new CreateResponse(TypesOfData.REG, JSON.stringify(result.getRegData()), result.getIndexUser()).getResponse();
  }

  public updateRoom(rooms: RoomsBase): string {
    return new CreateResponse(TypesOfData.UPDATE_ROOM, JSON.stringify(rooms.getUpdateRoom()), 0).getResponse();
  }

  public allWinnersUpdate(database: DataBase, sockets: Array<NamedSocket>) {
    const resp = new CreateResponse(TypesOfData.UPDATE_WINNERS, JSON.stringify(database.getAllWinners()), 0).getResponse();
    responseOutput(resp);
    sockets.forEach((socket: NamedSocket) => {
      socket && socket.getSocket().send(resp);
    });
  }

  public allRoomsUpdate(rooms: RoomsBase, sockets: Array<NamedSocket>): void {

    const roomsResponse: string = new CreateResponse(TypesOfData.UPDATE_ROOM, JSON.stringify(rooms.getUpdateRoom()), 0).getResponse();

    responseOutput(roomsResponse);

    sockets.forEach((socket: NamedSocket) => socket.getSocket().send(roomsResponse));
  }

  public addUserToRoom(fUser: UserData, sUser: UserData, rooms: RoomsBase): Array<string> {
    const playgrond: Playground = rooms.createPlayGround(fUser, sUser);

    const responseToOwner: string = new CreateResponse(
      TypesOfData.CREATE_GAME,
      JSON.stringify(playgrond.getGameDataOfOwner()),
      playgrond.getIdPlayeGround()).getResponse();

    const responseToSecondPlayer = new CreateResponse(
      TypesOfData.CREATE_GAME,
      JSON.stringify(playgrond.getGameDataOfSecondPlayer()),
      playgrond.getIdPlayeGround()).getResponse();

    return [responseToOwner, responseToSecondPlayer];
  }

  public addShips(shipsData: DataForAddShip, rooms: RoomsBase): boolean {
    const socket: NamedSocket = rooms.addShipsToPlayground(shipsData);

    let response: DataForStartGame;
    let returnResult: boolean;

    if (socket.getSocket()) {
      response = {
        currentPlayerIndex: shipsData.indexPlayer,
        ships: shipsData.ships
      };
    } else {
      response = {
        currentPlayerIndex: -1,
        ships: []
      };
    }

    if (rooms.checkPlayGroundForStartGame(shipsData.gameId)) {
      const stringResponse = new CreateResponse(TypesOfData.START_GAME, JSON.stringify(response), shipsData.gameId);
      responseOutput(stringResponse.getResponse());

      const sockets: Array<NamedSocket> = rooms.getNamedSocketsOfPlayGround(shipsData.gameId);

      sockets.forEach((socket: NamedSocket) => {
        responseOutput(stringResponse.getResponse());
        socket.getSocket().send(stringResponse.getResponse());
      });
      
      returnResult = true;
    } else {
      returnResult = false;
    }

    return returnResult;
  }

  public sendTurnPlayer(gameId: number, rooms: RoomsBase): void {
    if (rooms.checkPlayGroundForStartGame(gameId)) {
      const sockets: Array<NamedSocket> = rooms.getNamedSocketsOfPlayGround(gameId);
      const turn: boolean = Math.random() < 0.5 ?  true : false;
      const IdsOfPlayers: Array<number> = rooms.getIdPlayersOfPlayGround(gameId);
      const currentPlayerTurn: number = turn ? IdsOfPlayers[0] : IdsOfPlayers[1];

      const turnResponse: PalyersTurn = {
        currentPlayer: currentPlayerTurn
      };

      rooms.setFirstPlayerId(turnResponse.currentPlayer, gameId);

      const responseData = new CreateResponse(TypesOfData.TURN, JSON.stringify(turnResponse), gameId);

      sockets.forEach((socket: NamedSocket) => {
        responseOutput(responseData.getResponse());
        socket.getSocket().send(responseData.getResponse());
      });
    }
  }

  public handleTagetAttack(target: DataOfAttackRequset, rooms: RoomsBase, databse: DataBase): void {
    const idPlayersAttack = rooms.getPlayerTurnOfPlayGround(target.gameId, target.indexPlayer);

    if (idPlayersAttack.currentPlayer !== target.indexPlayer) {
      const attack = rooms.checkAttackPlayground(target);

      const sockets: NamedSocket[] = rooms.getNamedSocketsOfPlayGround(target.gameId);

      const attackResponse = new CreateResponse(TypesOfData.ATTACK, JSON.stringify(attack), target.indexPlayer);
      
      sockets.forEach((socket: NamedSocket) => {
        responseOutput(attackResponse.getResponse());
        socket.getSocket().send(attackResponse.getResponse());
      });
      
      const wins: boolean = rooms.checkWins(target);

      if (wins) {
        console.log('wins!!!!!!!!');
      } else {

        const turnResponse = new CreateResponse(TypesOfData.TURN, JSON.stringify(idPlayersAttack), target.indexPlayer);

        sockets.forEach((socket: NamedSocket) => {
          responseOutput(turnResponse.getResponse());
          socket.getSocket().send(turnResponse.getResponse());
        });
      }
    }

  }
}