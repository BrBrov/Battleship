import WebSocket, { RawData, WebSocketServer } from 'ws';
import DataBase from '../database/database';
import RoomsBase from '../database/rooms-base';
import NamedSocket from '../database/socket-object';


export default class GameController {
	private database: DataBase;
	private roomDataBase: RoomsBase;
	private allSockets: Array<NamedSocket>;

	constructor() {
		this.database = new DataBase();
		this.roomDataBase = new RoomsBase();
		this.allSockets = [];
	}

	public setSocket(socket: WebSocket): void {
			this.addToAllSockets(socket);
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

	public findSocketByName(name: string): NamedSocket {
		return this.allSockets.find((item: NamedSocket) => item && item.getName() === name);
	}

	public deleteNamedSocket(socket: NamedSocket): void {
		this.allSockets = this.allSockets.map((item: NamedSocket) => {
			if (item.getName() !== socket.getName()) return item;
		});
	}

	private addToAllSockets(socket: WebSocket): void {
		const newSocket = new NamedSocket(socket, this);
		this.allSockets.push(newSocket);
	}

	public deleteClosedNamedSockets(): void {
		this.allSockets = this.allSockets.filter((socket: NamedSocket) => socket.getSocket().readyState === 1);
	}
}