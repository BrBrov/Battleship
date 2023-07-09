import WebSocket, { RawData, WebSocketServer } from 'ws';
import DataBase from '../database/database';
import RoomsBase from '../database/rooms-base';
import NamedSocket from '../database/socket-object';


export default class GameController {
	private database: DataBase;
	private roomDataBase: RoomsBase;
	private allSockets: Array<NamedSocket>;
	private ws: WebSocketServer;

	constructor() {
		this.database = new DataBase();
		this.roomDataBase = new RoomsBase();
		this.allSockets = [];
	}

	public setWebSocketServer(ws: WebSocketServer): void {
		this.ws = ws;
	}

	public setSocket(socket: WebSocket): void {
		const newSocket = new NamedSocket(socket, this);
		this.allSockets.push(newSocket);
	}

	public getAllSockets(): Array<NamedSocket> {
		return this.allSockets;
	}

	public getDB(): DataBase {
		return this.database;
	}

	public getRooms(): RoomsBase {
		return this.roomDataBase;
	}

	public findNamedSocket(socket: WebSocket): NamedSocket {
		return this.allSockets.find((nSocket: NamedSocket) => nSocket.isSocketUser(socket));
	}

	public deleteClosedSocket(socket: WebSocket): void {
		this.allSockets = this.allSockets.map((item: NamedSocket) => {
			if (!item.isSocketUser(socket)) return item;
		});
	}
}