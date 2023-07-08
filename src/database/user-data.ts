import { User, WinnerData } from '../models/users-types';

export default class UserData {
	private user: User;
	private winsData: WinnerData;
	private index: number;
	constructor(user: User, index: number) {
		this.user = user;
		this.winsData = {
			name: user.name,
			wins: 0
		}
		this.index = index;
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
}