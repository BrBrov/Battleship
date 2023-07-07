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

export interface DataOfAttackResponse extends Position {
  gameID: number,
  indexPlayer: number
}

export interface DataOfAttackRequest {
  position: Position
  currentPlayer: number,
  status: "miss" | "killed" | "shot"
}

export interface DataOfRandomAttackResponse {
  gameID: number,
  indexPlayer: number
}

export interface PalyersTurn {
  currentPlayer: number
}

export interface FinishGame {
  winPlayer: number
}