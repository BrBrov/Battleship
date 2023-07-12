import { DataForAddShip, GameData } from './game-types';
import Room from '../database/room';
import UserData from '../database/user-data';
import BattleField from './battle-field';
import NamedSocket from '../database/socket-object';

export default class Playground {
	private gameOwner: GameData;
	private gameSecondPlayer: GameData;
	private room: Room;
	private fUser: UserData;
	private sUser: UserData;
	private fBattleField: BattleField | null;
	private sBattleField: BattleField | null;

	constructor(userOwnerGame: UserData, secondUser: UserData, room: Room) {
		this.fUser = userOwnerGame;
		this.sUser = secondUser;
		this.room = room;
		this.fBattleField = null;
		this.sBattleField = null;

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

	public getGameId(): number {
		return this.gameOwner.idGame;
	}

	public addBattleField(addShipData: DataForAddShip): NamedSocket {
		if (addShipData.gameId !== this.gameOwner.idGame) return;

		const battleField = new BattleField(addShipData);

		if (addShipData.indexPlayer === this.gameOwner.idPlayer) {
			this.fBattleField = battleField;
			return this.fUser.getNamedSocket();
		} else {
			this.sBattleField = battleField;
			return this.sUser.getNamedSocket();
		}

	}

	public checkBattleFields(): boolean {
		if (this.fBattleField && this.sBattleField) return true;

		return false;
	}

	public getSocketOwner(): NamedSocket {
		return this.fUser.getNamedSocket();
	}

	public getSocketSecondPlayer(): NamedSocket {
		return this.sUser.getNamedSocket();
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