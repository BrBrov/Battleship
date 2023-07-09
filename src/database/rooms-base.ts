import { UpdateRoom, UpdateRoomData } from '../models/room-types';
import DataBase from './database';
import Room from './room';
import UserData from './user-data';

export default class RoomsBase {
	private rooms: Array<Room>

	constructor() {
		this.rooms = [] as Array<Room>;
	}

	public addRoom(user: UserData, database: DataBase): void {
		const index = this.rooms.length ? this.rooms.length : 0;
		const newRoom = new Room(this.rooms.length);

		newRoom.addAnotherUserToRoom(user);
		
		this.rooms.push(newRoom);
	}

	public getUpdateRoom(): Array<UpdateRoom> {
		if (this.rooms.length === 0) return [];

		const updateRoom: Array<UpdateRoom> = this.rooms.map((item: Room) => {
			if (item.getRoomUsersCount() < 2) {
				return { roomId: item.getRoomId(), roomUsers: item.getUpdateRoom() };
			}
		});

		return updateRoom;
	}

}