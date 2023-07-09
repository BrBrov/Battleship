import { GameData } from '../models/game-types';
import Room from './room';
import UserData from './user-data';

export default class Playground {
	private gameOwner: GameData;
	private gameSecondPlayer: GameData;
	private room: Room;
	private fUser: UserData;
	private sUser: UserData;

	constructor(userOwnerGame: UserData, secondUser: UserData, room: Room) {
		this.fUser = userOwnerGame;
		this.sUser = secondUser;
		this.room = room;

		this.generateGameData();
	}

	public getGameDataOfOwner(): GameData {
		return this.gameOwner;
	}

	public getGameDataOfSecondPlayer(): GameData {
		return this.gameSecondPlayer;
	}

	public getIdPlayeGround(): number {
		return this.gameOwner.idGame;
	}

	private generateGameData(): void {
		this.gameOwner = {
			idGame: this.room.getRoomId(),
			idPlayer: this.fUser.getIndexUser(),
		};

		this.gameSecondPlayer = {
			idGame: this.room.getRoomId(),
			idPlayer: this.sUser.getIndexUser()
		};
	}

}