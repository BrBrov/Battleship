import { WebSocket } from 'ws';
import { RegData, User, WinnerData } from '../models/users-types';
import NamedSocket from './socket-object';

export default class UserData {
	private user: User;
	private winsData: WinnerData;
	private index: number;
	private socket: NamedSocket;
	
	constructor(user: User, index: number, socket: NamedSocket) {
		this.user = user;
		this.winsData = {
			name: user.name,
			wins: 0
		}
		this.index = index;
		this.socket = socket;
	}

	public getUserRecord(): User {
		return this.user;
	}

	public getAllWins(): WinnerData {
		return this.winsData;
	}

	public setaAnotherWins(): WinnerData {
		this.winsData.wins += 1;
		return this.winsData;
	}

	public getIndexUser(): number {
		return this.index
	}

	public getUserName(): string {
		return this.user.name;
	}

	public isUser(user: User): boolean {
		if (user.name === this.user.name && user.password === this.user.password) return true;

		return false;
	}

	public getNamedSocket(): NamedSocket {
		return this.socket;
	}

	public getRegData(): RegData {
		return {
			name: this.getUserName(),
			index: this.index,
			error: false,
			errorText: '',
		}
	}

	public checkUserName(name: string): boolean {
		return name === this.user.name;
	}

	public checkPassword(pass: string): boolean {
		return pass === this.user.password;
	}
}