import { UpdateRoomData } from '../models/room-types';
import UserData from './user-data';

export default class Room {
	private roomId: number;
	private roomUsers: Array<UpdateRoomData>

	constructor(id: number) {
		this.roomId = id;
		this.roomUsers = [] as Array<UpdateRoomData>;
	}

	public addAnotherUserToRoom(user: UserData): boolean {
		if (this.roomUsers.length >= 2) return false;
		if (this.roomUsers.some((item) => item.name === user.getUserName())) return false;

		this.roomUsers.push(this.doUpdateRoomData(user));
		return true;
	}

	public deleteUser(user: UserData): UpdateRoomData | null {
		if (this.roomUsers.length < 2) return null;

		this.roomUsers = this.roomUsers.filter((item: UpdateRoomData) => item.name !== user.getUserName());
		return this.doUpdateRoomData(user);
	}

	public getRoomId(): number {
		return this.roomId;
	}

	public getUpdateRoom(): Array<UpdateRoomData> {
		return this.roomUsers;
	}

	private doUpdateRoomData(user: UserData): UpdateRoomData {
		return {
			name: user.getUserName(),
			index: user.getIndexUser()
		};
	}

	public getRoomUsersCount(): number {
		return this.roomUsers.length;
	}

	public getUsersInRoom(): Array<UpdateRoomData> {
		return this.roomUsers;
	}

}