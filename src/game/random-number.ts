export default class RandomId {
	private result: number;
	constructor(ids: Array<number>) {
		this.result = this.generate(ids);
	}

	get id(): number {
		return this.result;
	}

	private generate(ids: Array<number>): number {

		let number: string = '';

		while (!number && !this.checkRoomId(Number(number), ids)) {
			let count = 0;

			while (count < 4) {
				number += String(Math.ceil(Math.random() * 100));
				count += 1;
			}
		}

		return Number(number);
	}

	private checkRoomId(id: number, ids: Array<number>): boolean {
		return ids.some((item: number) => item === id);
	}

}