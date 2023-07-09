import DataBase from '../../database/database';
import CreateResponse from '../../game/response-message';
import TypesOfData from '../../models/command-types';
import { RegData, User } from '../../models/users-types';
import RoomsBase from '../../database/rooms-base';
import NamedSocket from '../../database/socket-object';
import responseOutput from './response-console';
import UserData from '../../database/user-data';

export default class Handlers {
  public regHandler(user: User, database: DataBase, socket: NamedSocket): string {

    let result: UserData;

    if (!database.findUser(user)) {
      result = database.setUser(user, socket);
    }

    if (!database.checkUserForLogin(user)) {
      const err: RegData = {
        name: user.name,
        index: -1,
        error: true,
        errorText: 'Wrong user  login or password'
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
      socket.getSocket().send(resp);
    });
  }

  public allRoomsUpdate(rooms: RoomsBase, sockets: Array<NamedSocket>): void {

    const roomsResponse: string = new CreateResponse(TypesOfData.UPDATE_ROOM, JSON.stringify(rooms.getUpdateRoom()), 0).getResponse();

    responseOutput(roomsResponse);

    sockets.forEach((socket: NamedSocket) => socket.getSocket().send(roomsResponse));
  }
}