import { WebSocket } from 'ws';
import UserData from './user-data';
import { User } from '../models/users-types';
import { GeneralDataMessage } from '../models/request-types';
import requestOutput from '../websocket/handlers/request-console';
import GameController from '../game/game';
import HandlerSocket from '../game/handler-socket';

export default class NamedSocket {
	private socket: WebSocket;
	private handlerSocket: HandlerSocket;
	private gameController: GameController;
	private nameSocket: string;

	constructor(socket: WebSocket, gameController: GameController) {
		this.socket = socket;
		this.gameController = gameController;
		this.handlerSocket = new HandlerSocket(this, this.gameController);
    this.nameSocket = '';

		this.socket.on('message', (data) => {
			const recivedData = data.toString();

			const command: GeneralDataMessage = JSON.parse(recivedData);

			if (!requestOutput(command, socket)) return;

			this.handlerSocket.handler(command, this.socket);
		});

		this.socket.on('close', (webSocket: WebSocket) => {
			console.log(`Socket of ${webSocket} was closed\n`);

			gameController.deleteClosedSocket(webSocket);
		});
	}
	
	set name(name: string) {
		this.nameSocket = name;
	}

	get name(): string {
		return this.nameSocket;
	}

	public getSocket(): WebSocket {
		return  this.socket;
	}

	public isSocketUser(socket: WebSocket): boolean {
		return socket === this.socket;
	}
}