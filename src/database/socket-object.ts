import { WebSocket } from 'ws';
import UserData from './user-data';
import { User } from '../models/users-types';
import { GeneralDataMessage } from '../models/request-types';
import requestOutput from '../websocket/handlers/request-console';
import GameController from '../game/game';
import HandlerSocket from '../game/handler-socket';

export default class NamedSocket {
	public socket: WebSocket;
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

		this.socket.on('close', () => {
			console.log(`Socket of user ${this.nameSocket} was closed\n`);

			console.log(this.gameController.getAllSockets().length);

			this.gameController.deleteClosedNamedSockets();

			console.log(this.gameController.getAllSockets().length);
		});
	}
	
	public setName(name: string) {
		this.nameSocket = name;
	}

	public getName(): string {
		return this.nameSocket;
	}

	public getSocket(): WebSocket {
		return this.socket ? this.socket : undefined;
	}

	public isSocketUser(socket: WebSocket): boolean {
		if(socket === this.socket) return true;

		return false;
	}

	public setNewSocket(socket: WebSocket): void {
		this.socket = socket;
	}

	public checkSocketName(): boolean {
		return !!this.nameSocket
	}
}