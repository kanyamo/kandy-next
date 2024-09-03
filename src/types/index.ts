// プレイヤーを表すenum
export enum Player {
  Player1 = "player1",
  Player2 = "player2",
}

// ゲームの状態を表すenum
export enum GameStatus {
  Playing = "playing",
  Finished = "finished",
}

// 駒または城の基本インターフェース
export interface Piece {
  player: Player;
}

// コマを表すインターフェース
export interface GamePiece extends Piece {
  type: "piece";
}

// 城を表すインターフェース
export interface Castle extends Piece {
  type: "castle";
}

// ボードの位置を表すインターフェース
export interface Position {
  row: number;
  col: number;
}

// ボードのセルを表すタイプ
export type Cell = GamePiece | Castle | null;

// ボードを表すインターフェース
export interface Board {
  cells: Cell[][];
}

// ゲーム全体を表すインターフェース
export interface Game {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  selectedPiece: Position | null;
  winner: Player | null;
}
