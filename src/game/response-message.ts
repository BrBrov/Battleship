import { GeneralDataMessage } from '../models/request-types';

export default class CreateResponse {
	private type: string;
	private data: string;
	private id: number;

	constructor(type: string, data: string, id: number = 0) {
		this.type = type;
		this.data = data;
		this.id = id;
	}

	public getResponse(): string {
		return JSON.stringify({
			type: this.type,
			data: this.data,
			id: this.id
		});
	}
}