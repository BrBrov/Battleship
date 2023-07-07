export interface RoomData {
  indexRoom: number
}

export interface UpdateRoom {
  roomId: number,
  roomUsers: Array<UpdateRoomData>
}

export interface UpdateRoomData {
  name: string,
  index: number,
}