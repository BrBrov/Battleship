import { DataForAddShip } from './game-types';
import { Position, ShipPosition } from './ship-types';

enum ShipsTypes {
	huge = 4,
	large = 3,
	medium = 2,
	small = 1
}

interface ShipDataCreated {
	ship: ShipPosition,
	shipPoints: Array<Position>,
	forbiddenPositions: Array<Position>
}

export default class GenerateBotBatlleField {
	private battleField: DataForAddShip;
	private shipsArray: Array<ShipDataCreated> = [];

	constructor(idGame: number, indexPlayer: number) {
		this.battleField = this.generate(idGame, indexPlayer);
	}

	public getBattleField(): DataForAddShip {
		return this.battleField;
	}

	private generate(idGame: number, indexPlayer: number): DataForAddShip {

		for (let i = 0; i < 10; i += 1) {
			const direct: boolean = this.randomDirection();
			const [type, typeString]: [number, string] = this.getTypeShip(i);

			let check: boolean = false;
			let shipDataCreated: ShipDataCreated;

			while (!check) {
				shipDataCreated = this.generateDataOfShip(direct, type, typeString);

				check = this.checkPointToForrbiden(shipDataCreated);
			}

			this.shipsArray.push(shipDataCreated);
		}

		return this.createDataForAddShip(indexPlayer, idGame);
	}

	private generateDataOfShip(direct: boolean, type: number, typeString: string): ShipDataCreated {
		const startPoint: Position = this.randomStartPoint(type, direct);
		const shipPoints: Array<Position> = this.shipCreated(startPoint, direct, type);
		const shipData: ShipDataCreated = {
			ship: {
				position: startPoint,
				direction: direct,
				length: type,
				type: typeString as "small" | "medium" | "large" | "huge"
			},
			shipPoints: shipPoints,
			forbiddenPositions: []
		};

		const shipCreatedData: ShipDataCreated = this.createForbidenEnviroment(shipData);
		return shipCreatedData;
	}

	private randomDirection(): boolean {
		return Math.ceil(Math.random() * 10) < 5 ? true : false;
	}

	private randomStartPoint(type: number, direct: boolean): Position {
		let maxX: number;
		let maxY: number;

		if (direct) {
			maxX = 0;
			maxY = 10 - type;
		} else {
			maxX = 10 - type;
			maxY = 0;
		}

		return this.getRandomPoint(maxX, maxY);
	}

	private getTypeShip(index: number): [number, string] {

		if (index === 0) {
			return [ShipsTypes.huge, 'huge'];
		}

		if (index < 3) {
			return [ShipsTypes.large, 'large'];
		}

		if (index < 6) {
			return [ShipsTypes.medium, 'medium'];
		}

		if (index < 10) {
			return [ShipsTypes.small, 'small'];
		}

		return [0, ''];
	}

	private getRandomPoint(maxX: number, maxY: number): Position {
		return {
			x: Math.ceil(Math.random() * (maxX + 1)),
			y: Math.ceil(Math.random() * (maxY + 1))
		}
	}

	private shipCreated(startPoint: Position, direct: boolean, type: number): Array<Position> {
		const shipPoints: Array<Position> = [startPoint];

		for (let i = 1; i < type; i++) {
			let x: number;
			let y: number;

			if (direct) {
				x = startPoint.x;
				y = startPoint.y + i;
			} else {
				x = startPoint.x + i;
				y = startPoint.y;
			}

			shipPoints.push({ x: x, y: y });
		}

		return shipPoints;
	}

	private createForbidenEnviroment(shipData: ShipDataCreated): ShipDataCreated {
		const shipCreatedData = shipData;

		for (let i = 0; i < shipCreatedData.shipPoints.length; i += 1) {
			const point: Position = shipCreatedData.shipPoints[i];

			const aroundPoints: Array<Position> = [];

			aroundPoints.push(point);
			aroundPoints.push(this.position(point.x + 1, point.y));
			aroundPoints.push(this.position(point.x + 1, point.y + 1));
			aroundPoints.push(this.position(point.x, point.y + 1));
			aroundPoints.push(this.position(point.x - 1, point.y + 1));
			aroundPoints.push(this.position(point.x - 1, point.y));
			aroundPoints.push(this.position(point.x - 1, point.y - 1));
			aroundPoints.push(this.position(point.x, point.y - 1));
			aroundPoints.push(this.position(point.x + 1, point.y - 1));

			shipCreatedData.forbiddenPositions = [...shipCreatedData.forbiddenPositions, ...aroundPoints];
		}

		shipCreatedData.forbiddenPositions = shipCreatedData.forbiddenPositions.filter((pAround: Position) => {
			return !shipCreatedData.shipPoints.some((pShip: Position) => pAround.x === pShip.x && pAround.y === pShip.y)
		});
		return shipCreatedData;
	}

	private checkPointToForrbiden(shipCreatedData: ShipDataCreated): boolean {

		if (!this.shipsArray.length) return true;

		for (let i = 0; i < this.shipsArray.length; i++) {
			const savedShipDataCreated = this.shipsArray[i];
			const forbidden = savedShipDataCreated.forbiddenPositions;

			for (let j = 0; j < shipCreatedData.shipPoints.length; j++) {
				const pointOfCreatedShip = shipCreatedData.shipPoints[j];
				const result: boolean = forbidden.some((pointSavedShip) => {
					return pointOfCreatedShip.x === pointSavedShip.x && pointOfCreatedShip.y === pointSavedShip.y;
				});

				if (result) return false;
			}
		}
		return true;
	}

	private position(x: number, y: number): Position {
		return {
			x: x,
			y: y
		}
	}

	private createDataForAddShip(indexPlayer: number, idGame: number): DataForAddShip {
		return {
			gameId: idGame,
			ships: this.shipsArray.map((shipData: ShipDataCreated) => shipData.ship),
			indexPlayer: indexPlayer
		};
	}
}