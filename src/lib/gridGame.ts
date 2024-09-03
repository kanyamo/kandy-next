import { Board, Player, GameStatus, Position, IGame, PieceType } from "@/types";

export class GridGame implements IGame {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  selectedPiece: Position | null;
  winner: Player | null;
  boardSize: number;

  constructor(
    board: Board,
    currentPlayer: Player,
    status: GameStatus,
    selectedPiece: Position | null,
    winner: Player | null,
    boardSize: number
  ) {
    this.board = board;
    this.currentPlayer = currentPlayer;
    this.status = status;
    this.selectedPiece = selectedPiece;
    this.winner = winner;
    this.boardSize = boardSize;
  }

  copy(): GridGame {
    return new GridGame(
      {
        cells: this.board.cells.map((row) => row.map((cell) => ({ ...cell }))),
      },
      this.currentPlayer,
      this.status,
      this.selectedPiece,
      this.winner,
      this.boardSize
    );
  }

  static initialize(boardSize: number, currentPlayer?: Player): GridGame {
    const newGame = new GridGame(
      {
        cells: Array(boardSize)
          .fill(null)
          .map(() =>
            Array(boardSize).fill({
              piece: null,
              isTerritory: { [Player.Player1]: false, [Player.Player2]: false },
            })
          ),
      },
      currentPlayer ?? Player.Player1,
      GameStatus.Playing,
      null,
      null,
      boardSize
    );

    // Player1の初期配置
    const player1CastlePosition: Position = { row: 0, col: 4 };
    newGame.board.cells[player1CastlePosition.row][player1CastlePosition.col] =
      {
        piece: {
          type: PieceType.Castle,
          player: Player.Player1,
        },
        isTerritory: { [Player.Player1]: true, [Player.Player2]: false },
      };
    for (const position of newGame.getSurroundingPositions(
      player1CastlePosition
    )) {
      newGame.board.cells[position.row][position.col] = {
        piece: {
          type: PieceType.Piece,
          player: Player.Player1,
        },
        isTerritory: { [Player.Player1]: true, [Player.Player2]: false },
      };
    }

    // Player2の初期配置
    const player2CastlePosition: Position = { row: 8, col: 4 };
    newGame.board.cells[player2CastlePosition.row][player2CastlePosition.col] =
      {
        piece: {
          type: PieceType.Castle,
          player: Player.Player2,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: true },
      };
    for (const position of newGame.getSurroundingPositions(
      player2CastlePosition
    )) {
      newGame.board.cells[position.row][position.col] = {
        piece: {
          type: PieceType.Piece,
          player: Player.Player2,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: true },
      };
    }

    return newGame;
  }

  getSurroundingPositions(position: Position): Position[] {
    const { row, col } = position;
    const positions: Position[] = [];

    // 上下左右
    if (row > 0) positions.push({ row: row - 1, col });
    if (row < this.boardSize - 1) positions.push({ row: row + 1, col });
    if (col > 0) positions.push({ row, col: col - 1 });
    if (col < this.boardSize - 1) positions.push({ row, col: col + 1 });

    // 斜め
    if (row > 0 && col > 0) positions.push({ row: row - 1, col: col - 1 });
    if (row > 0 && col < this.boardSize - 1)
      positions.push({ row: row - 1, col: col + 1 });
    if (row < this.boardSize - 1 && col > 0)
      positions.push({ row: row + 1, col: col - 1 });
    if (row < this.boardSize - 1 && col < this.boardSize - 1)
      positions.push({ row: row + 1, col: col + 1 });

    return positions;
  }

  getCapturedPositions(position: Position): Position[] {
    const { row, col } = position;
    const capturedPositions: Position[] = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    const currentPlayer = this.board.cells[row][col]?.piece?.player;
    if (!currentPlayer) return capturedPositions;

    directions.forEach(([dx, dy]) => {
      let x = row + dx;
      let y = col + dy;
      const tempCaptured: Position[] = [];
      const isDiagonal = dx !== 0 && dy !== 0;

      while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize) {
        const piece = this.board.cells[x][y].piece;
        if (!piece) break;
        if (piece.player === currentPlayer) {
          capturedPositions.push(...tempCaptured);
          break;
        }
        tempCaptured.push({ row: x, col: y });
        x += dx;
        y += dy;
      }
    });

    return capturedPositions;
  }

  isValidMove(from: Position, to: Position): boolean {
    if (Math.abs(from.row - to.row) > 1 || Math.abs(from.col - to.col) > 1)
      return false;
    if (this.board.cells[to.row][to.col].piece !== null) return false;
    return true;
  }

  movePiece(from: Position, to: Position): void {
    const piece = this.board.cells[from.row][from.col].piece;
    this.board.cells[from.row][from.col].piece = null;
    this.board.cells[to.row][to.col].piece = piece;

    const capturedPieces = this.getCapturedPositions(to);
    capturedPieces.forEach(({ row, col }) => {
      this.board.cells[row][col].piece = null;
    });

    this.currentPlayer =
      this.currentPlayer === Player.Player1 ? Player.Player2 : Player.Player1;

    this.checkWinCondition();
  }

  checkWinCondition(): void {
    // ここに勝利条件の判定処理を実装
  }
}
