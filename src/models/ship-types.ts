export interface ShipPosition {
  position: Position,
  direction: boolean,
  length: number,
  type: "small" | "medium" | "large" | "huge",
}

export interface Position {
  x: number,
  y: number
}

export class MatrixPosition {
  public x: number;
  public y: number;
  public type: "small" | "medium" | "large" | "huge";
  constructor(x: number, y: number, type: "small" | "medium" | "large" | "huge") {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}