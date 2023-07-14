import { Attack, DataForAddShip, DataOfAttackRequset, DataOfAttackResponse, GameData } from './game-types';
import Room from '../database/room';
import UserData from '../database/user-data';
import BattleField from './battle-field';
import NamedSocket from '../database/socket-object';
import { Position } from './ship-types';

export default class Playground {
	private gameOwner: GameData;
	private gameSecondPlayer: GameData;
	private room: Room | null;
	private fUser: UserData;
	private sUser: UserData;
	private fBattleField: BattleField | null;
	private sBattleField: BattleField | null;
	private idPlayerTurn: number | null;

	constructor(userOwnerGame: UserData, secondUser: UserData, room: Room) {
		this.fUser = userOwnerGame;
		this.sUser = secondUser;
		this.room = room;
		this.fBattleField = null;
		this.sBattleField = null;
		this.idPlayerTurn = null;

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
			this.sBattleField = battleField;
			return this.sUser.getNamedSocket();
		} else {
			this.fBattleField = battleField;;
			return this.fUser.getNamedSocket();
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

	public setPlayerTurn(playerId: number): void {
		if (!this.idPlayerTurn) {
			this.idPlayerTurn = playerId;
			return;
		}
		if (playerId === this.gameOwner.idPlayer || playerId === this.gameSecondPlayer.idPlayer) {
			this.idPlayerTurn = playerId;
		}
	}

	public switchPlayerTurn(playerId: number): number {

		if (playerId === this.idPlayerTurn) {
			this.idPlayerTurn = this.gameOwner.idPlayer === this.idPlayerTurn ? this.gameSecondPlayer.idPlayer : this.gameOwner.idPlayer;
			return this.idPlayerTurn;
		}

		return playerId;
	}

	public checkShoot(target: DataOfAttackRequset): DataOfAttackResponse {
		const field = this.sBattleField.getPlayerId() === target.indexPlayer ? this.fBattleField : this.sBattleField;

		const position: Position = {
			x: target.x,
			y: target.y
		};

		const shootStatus: Attack = field.checkShoot(position);

		return {
			currentPlayer: target.indexPlayer,
			...shootStatus
		}
	}

	public checkForWins(target: DataOfAttackRequset): boolean {
		const field = this.sBattleField.getPlayerId() === target.indexPlayer ? this.fBattleField : this.sBattleField;
		return field.checkWins();
	}

	public getSocketByPlayerId(playerId: number): NamedSocket {
		return this.gameOwner.idPlayer === playerId ? this.fUser.getNamedSocket() : this.sUser.getNamedSocket();
	}

	public getPlayedUsers(): Array<UserData> {
		return [this.fUser, this.sUser];
	}

	public determineTheWinner(): number {
		const fWin = this.fBattleField.checkWins();

		return fWin ? this.sBattleField.getPlayerId() : this.fBattleField.getPlayerId();
	}

	public botAttack(): Position {
		return this.sBattleField.botAttack()
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