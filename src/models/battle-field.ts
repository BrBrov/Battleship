import { DataForAddShip } from './game-types';
import { MatrixPosition, Position, ShipPosition } from './ship-types';

export default class BattleField {
	private field: Array<Array<null | MatrixPosition>>;
	private gameId: number;
	private playerId: number;

	constructor(ships: DataForAddShip) {
		this.gameId = ships.gameId;
		this.playerId = ships.indexPlayer;
		this.doField(ships.ships);
	}

	public getGameId(): number {
		return this.gameId;
	}

	public getPlayrId(): number {
		return this.playerId;
	}

	private doField(shipsPositions: Array<ShipPosition>): void {
		const matrix = new Array(10).fill(new Array(10).fill(null)) as Array<Array<null | MatrixPosition>>;

		shipsPositions.forEach((ship: ShipPosition) => {

			switch (ship.direction) {
				case false:
					for (let i = 0; i < ship.length; i += 1) {
						const x: number = ship.position.x + i;
						const y: number = ship.position.y;
						const matrixPosition = new MatrixPosition(x, y, ship.type);
						matrix[x][y] = matrixPosition;
					}
					break;
				case true:
					for (let i = 0; i < ship.length; i += 1) {
						const x: number = ship.position.x;
						const y: number = ship.position.y + i;
						const matrixPosition = new MatrixPosition(x, y, ship.type);
						matrix[x][y] = matrixPosition;
					}
					break;
			}
		});
		this.field = matrix;
	}
}