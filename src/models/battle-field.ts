import { Attack, DataForAddShip } from './game-types';
import MatrixShip from './matrix-ships';
import { Position } from './ship-types';

export default class BattleField {
	private field: MatrixShip;
	private gameId: number;
	private playerId: number;

	constructor(ships: DataForAddShip) {
		this.gameId = ships.gameId;
		this.playerId = ships.indexPlayer;
		this.field = new MatrixShip(ships.ships);
	}

	public getGameId(): number {
		return this.gameId;
	}

	public getPlayerId(): number {
		return this.playerId;
	}

	public checkShoot(target: Position): Attack {
		return this.field.checkShoot(target);
	}

	public checkWins(): boolean {
		return this.field.checkIsAllShipDead();
	}
}