export default class CreateResponse {
	private type: string;
	private data: string;
	private id: number;

	constructor(type: string, data: string, id?: number) {
		this.type = type;
		this.data = data;
		this.id = id ? id : 0;
	}

	public getResponse(): string {
		return JSON.stringify({
			type: this.type,
			data: this.data,
			id: this.id
		});
	}
}