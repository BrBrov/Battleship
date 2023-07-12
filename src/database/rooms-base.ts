import RandomId from '../game/random-number';
import { UpdateRoom, UpdateRoomData } from '../models/room-types';
import Playground from '../models/game-playground';
import Room from './room';
import UserData from './user-data';
import { DataForAddShip, DataOfAttackRequset, DataOfAttackResponse, FinishGame, PalyersTurn } from '../models/game-types';
import NamedSocket from './socket-object';

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
			const itemUser = item.getRoomUsers();
			return { roomId: id, roomUsers: itemUser };
		});

		return updateRoom;
	}

	public findRoomById(id: number): Room {
		return this.rooms.find((item: Room) => item.getRoomId() === id);
	}

	public deleteRoomById(id: number): void {
		this.rooms = this.rooms.filter((item: Room) => {
			if (item.getRoomId() !== id) return item;
		});
	}

	public createPlayGround(fUser: UserData, sUser: UserData): Playground {
		const roomOwner = fUser.getRoom();
		const roomSecondPlayer = sUser.getRoom();

		const playground = new Playground(fUser, sUser, roomOwner);
		this.playgrounds.push(playground);

		this.rooms = this.rooms.filter((room: Room) => {
			if (room.getRoomId() !== roomOwner.getRoomId() && room.getRoomId() !== roomSecondPlayer.getRoomId()) {
				return room;
			}
		});

		return playground;
	}

	public addShipsToPlayground(shipsData: DataForAddShip): NamedSocket {
		const playground = this.findPLayground(shipsData.gameId);

		return playground.addBattleField(shipsData);
	}

	public checkPlayGroundForStartGame(gameId: number): boolean {
		const playgrond = this.findPLayground(gameId);
		
		if (!playgrond) return false;

		return playgrond.checkBattleFields();
	}

	public getNamedSocketsOfPlayGround(gameId: number): Array<NamedSocket> {
		const playgrond = this.findPLayground(gameId);
		
		if (playgrond) {
			return [playgrond.getSocketOwner(), playgrond.getSocketSecondPlayer()];
		}

	}

	public getIdPlayersOfPlayGround(gameId: number): Array<number> {
		const playgrond = this.findPLayground(gameId);
		const ownerID: number = playgrond.getGameDataOfOwner().idPlayer;
		const secondPlayerId: number = playgrond.getGameDataOfSecondPlayer().idPlayer;

		return [ownerID, secondPlayerId];
	}

	public getPlayerTurnOfPlayGround(gameId: number, playerId: number): PalyersTurn {
		const playgrond = this.findPLayground(gameId);

		const idTurnPlayer = playgrond.switchPlayerTurn(playerId);

		return {
			currentPlayer: idTurnPlayer
		}
	}

	public checkAttackPlayground(target: DataOfAttackRequset): DataOfAttackResponse {
		const playgrond = this.findPLayground(target.gameId);

		return playgrond.checkShoot(target);
	}

	public checkWins(target: DataOfAttackRequset): boolean {
		const playgrond = this.findPLayground(target.gameId);

		return playgrond.checkForWins(target);
	}

	public setFirstPlayerId(playerId: number, gameId: number): void {
		const playgrond = this.findPLayground(gameId);
		playgrond.setPlayerTurn(playerId);
	}

	public getWinnersPlyer(target: DataOfAttackRequset): FinishGame {
		const playgrond = this.findPLayground(target.gameId);
		
		const idWinner = playgrond.determineTheWinner();

		return {
			winPlayer: idWinner
		}
	}

	public deletePlayground(gameId: number): void {
		this.playgrounds = this.playgrounds.filter((pGround: Playground) => pGround.getGameId() === gameId);
	}

	private findPLayground(gameId: number): Playground {
		return this.playgrounds.find((area: Playground) => area.getGameId() === gameId);
	}
}