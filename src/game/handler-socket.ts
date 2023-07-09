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
				const user: UserData = this.game.getDB().findUserBySocket(socket);

				const rooms: RoomsBase = this.game.getRooms();

				rooms.addRoom(user);

				const roomsUpdate = this.generalHandler.allRoomsUpdate(rooms, this.game.getAllSockets());

				break;
		}
	}
}