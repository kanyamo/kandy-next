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

// 駒または城のタイプを表すenum
export enum PieceType {
  Piece = "piece", // 駒
  Castle = "castle", // 城
  Wall = "wall", // 壁
}

// 駒または城, 壁のインターフェース
export interface Piece {
  player: Player | null;
  type: PieceType;
}

// ボードの位置を表すインターフェース
export interface Position {
  row: number;
  col: number;
}

// ボードのセルを表すタイプ
export type Cell = {
  piece: Piece | null; // マスに配置されているもの
  isTerritory: Record<Player, boolean>; // プレイヤーの領地かどうか
};

// ボードを表すインターフェース
export interface Board {
  cells: Cell[][]; // セルの配置を表す二次元配列
}

// ゲーム全体を表すインターフェース
export interface IGame {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  selectedPiece: Position | null;
  winner: Player | null;
  boardSize: number;
  copy: () => IGame;
  getSurroundingPositions: (position: Position) => Position[];
  getCapturedPositions: (position: Position) => Position[];
  isValidMove: (from: Position, to: Position) => boolean;
  movePiece: (from: Position, to: Position) => void;
  checkWinCondition: () => void;
}
