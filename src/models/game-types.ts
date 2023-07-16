import { ShipPosition, Position} from './ship-types';

export interface GameData {
  idGame: number,
  idPlayer: number,
}

export interface DataForAddShip {
  gameId: number,
  ships: Array<ShipPosition>
  indexPlayer: number
}

export interface DataForStartGame {
  ships: Array<ShipPosition>
  currentPlayerIndex: number
}

export interface DataOfAttackRequset extends Position {
  gameId: number,
  indexPlayer: number
}

export interface Attack {
  position: Position
  status: "miss" | "killed" | "shot"
}

export interface DataOfAttackResponse extends Attack{
  currentPlayer: number
}

export interface DataOfRandomAttackRequest {
  gameId: number,
  indexPlayer: number
}

export interface PalyersTurn {
  currentPlayer: number
}

export interface FinishGame {
  winPlayer: number
}