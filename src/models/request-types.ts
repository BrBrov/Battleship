import { RegData, User, WinnersData } from './users-types';
import { RoomData, UpdateRoom } from './room-types';
import {
  GameData,
  DataForAddShip,
  DataForStartGame,
  DataOfAttackRequest,
  DataOfAttackResponse,
  DataOfRandomAttackResponse,
  PalyersTurn,
  FinishGame
} from './game-types';


export interface GeneralDataMessage {
  type: string,
  data: User| RegData | Array<WinnersData> | RoomData | GameData | Array<UpdateRoom> | DataForAddShip | DataForStartGame | DataOfAttackRequest | DataOfAttackResponse | DataOfRandomAttackResponse | PalyersTurn | FinishGame | "",
  id: number
}
