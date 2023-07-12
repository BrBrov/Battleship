import WebSocket from 'ws';
import { GeneralDataMessage } from '../models/request-types';
import TypesOfData from '../models/command-types';
import { User } from '../models/users-types';
import NamedSocket from '../database/socket-object';
import Handlers from '../websocket/handlers/general-handler';
import responseOutput from '../websocket/handlers/response-console';
import GameController from './game';
import UserData from '../database/user-data';
import RoomsBase from '../database/rooms-base';
import { RoomData } from '../models/room-types';
import { DataForAddShip } from '../models/game-types';

export default class HandlerSocket {
	private generalHandler: Handlers;
	private nSocket: NamedSocket;
	private game: GameController;

	constructor(nSocket: NamedSocket, game: GameController) {
		this.nSocket = nSocket;
		this.game = game;
		this.generalHandler = new Handlers();
	}

	public handler(command: GeneralDataMessage, socket: WebSocket): void {
		let findUser: UserData;

		switch (command.type) {
			case TypesOfData.REG:

				const data: User = JSON.parse(command.data);

				if (!this.nSocket.checkSocketName()) {

					this.nSocket.setName(data.name);
				}

				const response: string = this.generalHandler.regHandler(data, this.game.getDB(), this.nSocket);

				responseOutput(response);

				socket.send(response);

				const updateRooms: string = this.generalHandler.updateRoom(this.game.getRooms());

				socket.send(updateRooms);

				this.generalHandler.allWinnersUpdate(this.game.getDB(), this.game.getAllSockets());

				break;
			case TypesOfData.CREATE_ROOM:
				findUser = this.game.getDB().findUserBySocket(socket);

				const rooms: RoomsBase = this.game.getRooms();

				rooms.addRoom(findUser);

				this.generalHandler.allRoomsUpdate(rooms, this.game.getAllSockets());

				break;
			case TypesOfData.ADD_USER_TO_ROOM:
				const roomIdObj = JSON.parse(command.data) as RoomData;
				findUser = this.game.getDB().findUserBySocket(socket);
				if (roomIdObj.indexRoom !== findUser.getIndexRoom()) {
					const fUser: UserData = this.game.getDB().findUserByIdRoom(roomIdObj.indexRoom);
					const responses: Array<string> = this.generalHandler.addUserToRoom(fUser, findUser, this.game.getRooms());

					fUser.getNamedSocket().getSocket().send(responses[0]);
					findUser.getNamedSocket().getSocket().send(responses[1]);

					this.generalHandler.allRoomsUpdate(this.game.getRooms(), this.game.getAllSockets());
				}
				break;
			case TypesOfData.ADD_SHIPS:
				const shipsData = JSON.parse(command.data) as DataForAddShip;
				const resultOperation = this.generalHandler.addShips(shipsData, this.game.getRooms());
				
				if (resultOperation) {
					this.generalHandler.sendTurnPlayer(shipsData.gameId, this.game.getRooms());
				}
				break;
			case TypesOfData.ATTACK:
				console.log('target attak---->', JSON.parse(command.data));
				break;
			case TypesOfData.RANDOM_ATTACK:
				console.log('random attak---->', JSON.parse(command.data));
				break;
		}
	}
}