import { RegData, User, WinnerData } from '../models/users-types';
import Room from './room';
import NamedSocket from './socket-object';

export default class UserData {
	private user: User;
	private winsData: WinnerData;
	private index: number | null;
	private socket: NamedSocket;
	private room: Room = undefined;
	
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
			name: this.user.name,
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

	public setRoom(room: Room): void {
		this.room = room;
	}

	public getRoom(): Room {
		return this.room;
	}

	public deleteRoom(): void{
		this.room = undefined;
	}

	public getIndexRoom(): number {
		return this.room ? this.room.getRoomId() : null;
	}
}