import RandomId from '../game/random-number';
import { UpdateRoom, UpdateRoomData } from '../models/room-types';
import Playground from './game-playgrond';
import Room from './room';
import UserData from './user-data';

export default class RoomsBase {
	private rooms: Array<Room>;
	private playgrounds: Array<Playground>;

	constructor() {
		this.rooms = [];
		this.playgrounds = [];
	}

	public addRoom(user: UserData): void {

		const isPlayer: boolean = this.rooms.some((item: Room) => {
			const roomUsers = item.getUsersInRoom();
			const userName = user.getUserName();
			const result = roomUsers.some((player: UpdateRoomData) => player.name === userName);

			return result;
		});

		if (!isPlayer) {
			const random = new RandomId(this.rooms.map((item: Room) => item.getRoomId()));
			const index = random.id;
			const newRoom = new Room(index);
			user.setRoom(newRoom);

			const result: boolean = newRoom.addAnotherUserToRoom(user);

			if (result) this.rooms.push(newRoom);
		}
	}

	public getUpdateRoom(): Array<UpdateRoom> {
		if (this.rooms.length === 0) return [];

		const updateRoom: Array<UpdateRoom> = this.rooms.map((item: Room) => {
			const id = item.getRoomId();
			const itemUser = item.getUpdateRoom();
			return { roomId: id, roomUsers: itemUser };
		});

		return updateRoom;
	}

	public findRoomById(id: number): Room {
		return this.rooms.find((item: Room) => item.getRoomId() === id);
	}

	public deleteRoomById(id: number): void {
		this.rooms = this.rooms.map((item: Room) => {
			if (item.getRoomId() !== id) return item;
		});
	}

	public createPlayGround(fUser: UserData, sUser: UserData): Playground {
		const roomOwner = fUser.getRoom();
		const roomSecondPlayer = sUser.getRoom();

		const playground = new Playground(fUser, sUser, roomOwner);
		this.playgrounds.push(playground);

		this.rooms = this.rooms.map((room: Room) => {
			if (room.getRoomId() !== roomOwner.getRoomId() && room.getRoomId() !== roomSecondPlayer.getRoomId()) {
				return room;
			}
		});

		console.log(this.rooms);

		return playground;
	}

}