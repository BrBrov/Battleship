import { Attack } from './game-types';
import { Position, ShipPosition } from './ship-types';

interface Cell extends Position {
	hole: boolean
}

type Matrix = {
	position: Array<Cell>,
	type: "small" | "medium" | "large" | "huge",
	isDead: boolean;
}

export default class MatrixShip {
	private matrix: Array<Matrix>;
	private doneShoots: Array<Attack>;
	private doneAttack: Array<Position>;

	constructor(ships: Array<ShipPosition>) {
		this.matrix = this.doMatrix(ships);
		this.doneShoots = [] as Array<Attack>;
		this.doneAttack = [] as Array<Position>;
	}

	public checkShoot(target: Position): Attack {
		//TODO: delete
		const isItAttackWas = this.doneShoots.some((shoot: Attack) => shoot.position.x === target.x && shoot.position.y === target.y);

		if (isItAttackWas) {
			return this.doneShoots.find((shoot: Attack) => shoot.position.x === target.x && shoot.position.y === target.y);
		}

		let attack: Attack;

		const result = this.matrix.find((ship: Matrix) => {
			const coor = ship.position.find((pos: Position) => pos.x === target.x && pos.y === target.y)
			if (!ship.isDead && coor) {
				return ship;
			}
		});

		if (result) {
			const cell: Cell = result.position.find((pos: Position) => pos.x === target.x && pos.y === target.y);

			if (!cell.hole) {
				cell.hole = true;
			}
			result.isDead = result.position.every((cell: Cell) => cell.hole);

			const status = this.checkStatusShip(result);

			attack = {
				position: target,
				status: status
			};

			this.doneShoots.push();
			return attack;
		}

		attack = {
			position: target,
			status: 'miss'
		};

		this.doneShoots.push();
		return attack;
	}

	public checkIsAllShipDead(): boolean {
		return this.matrix.every((ship: Matrix) => ship.isDead);
	}

	public generateRandomAttack(): Position {
		let position: Position;
		if (!this.doneAttack.length) {
			position = this.randomXY();
			this.doneAttack.push(position);
			return position;
		}

		let check = true;

		while (check) {
			position = this.randomXY();
			
			check = this.doneAttack.some((attack: Position) => attack.x === position.x && attack.y === position.y);
		}

		return position;
	}

	private doMatrix(ships: Array<ShipPosition>): Array<Matrix> {
		return ships.map((ship: ShipPosition) => {

			let cellOfMatrix: Matrix;
			let position: Array<Cell>;

			switch (ship.direction) {
				case false:
					position = [];

					for (let i = 0; i < ship.length; i += 1) {
						const cellOfPosition: Cell = {
							x: ship.position.x + i,
							y: ship.position.y,
							hole: false
						}
						position.push(cellOfPosition);
					}

					cellOfMatrix = {
						position: position,
						type: ship.type,
						isDead: false
					};

					return cellOfMatrix;

				case true:
					position = [];

					for (let i = 0; i < ship.length; i += 1) {
						const cellOfPosition: Cell = {
							x: ship.position.x,
							y: ship.position.y + i,
							hole: false
						}
						position.push(cellOfPosition);
					}

					cellOfMatrix = {
						position: position,
						type: ship.type,
						isDead: false
					};

					return cellOfMatrix;
			}
		});
	}

	private checkStatusShip(ship: Matrix): "killed" | "shot" {
		if (ship.position.every((cell: Cell) => cell.hole)) return 'killed';

		return 'shot';
	}

	private randomXY(): Position {
		const x = Math.ceil(Math.random() * 10);
		const y = Math.ceil(Math.random() * 10);

		return {
			x: x,
			y: y
		};
	}
}