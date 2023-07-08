import { database, DataBase } from '../database/database';
import TypesOfData from '../models/command-types';
import { GeneralDataMessage } from '../models/request-types';
import { RegData, User } from '../models/users-types';
import CreateResponse from './response-message';

export default class GameController {
	private database: DataBase;
	constructor() {
		this.database = database;
	}

	public handleReg(user: User): string {
		const userFromDb = this.database.userHandler(user);
		const responseData: RegData = {
			name: '',
			index: 0,
			error: false,
			errorText: ''
		};

		if (userFromDb) {
			responseData.name = userFromDb.getUserName();
			responseData.index = userFromDb.getIndexUser();
		}

		return new CreateResponse(TypesOfData.REG, JSON.stringify(responseData), userFromDb.getIndexUser()).getResponse();
	}

	public handlerAllWinners(): string {
		const allWinners = this.database.getAllWinners();

		return new CreateResponse(TypesOfData.UPDATE_WINNERS, JSON.stringify(allWinners)).getResponse();
	}
}