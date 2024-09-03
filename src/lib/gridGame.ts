import { Board, Player, GameStatus, Position, IGame, PieceType } from "@/types";
import { getOpponent } from "./utils";

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
    const player1CastlePosition: Position = {
      row: 1,
      col: (boardSize - 1) / 2,
    };
    newGame.board.cells[player1CastlePosition.row][player1CastlePosition.col] =
      {
        piece: {
          type: PieceType.Castle,
          player: Player.Player1,
        },
        isTerritory: { [Player.Player1]: true, [Player.Player2]: false },
      };
    for (const position of newGame.getSurroundingPositions(
      player1CastlePosition,
      [
        [1, 0],
        [1, -1],
        [1, 1],
        [0, -1],
        [0, 1],
      ]
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
    const player2CastlePosition: Position = {
      row: boardSize - 2,
      col: (boardSize - 1) / 2,
    };
    newGame.board.cells[player2CastlePosition.row][player2CastlePosition.col] =
      {
        piece: {
          type: PieceType.Castle,
          player: Player.Player2,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: true },
      };
    for (const position of newGame.getSurroundingPositions(
      player2CastlePosition,
      [
        [-1, 0],
        [-1, -1],
        [-1, 1],
        [0, -1],
        [0, 1],
      ]
    )) {
      newGame.board.cells[position.row][position.col] = {
        piece: {
          type: PieceType.Piece,
          player: Player.Player2,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: true },
      };
    }

    // 壁の配置
    // 外周に壁を配置
    for (let i = 0; i < boardSize; i++) {
      // 上辺
      newGame.board.cells[0][i] = {
        piece: {
          type: PieceType.Wall,
          player: null,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: false },
      };
      // 下辺
      newGame.board.cells[boardSize - 1][i] = {
        piece: {
          type: PieceType.Wall,
          player: null,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: false },
      };
      // 左辺
      newGame.board.cells[i][0] = {
        piece: {
          type: PieceType.Wall,
          player: null,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: false },
      };
      // 右辺
      newGame.board.cells[i][boardSize - 1] = {
        piece: {
          type: PieceType.Wall,
          player: null,
        },
        isTerritory: { [Player.Player1]: false, [Player.Player2]: false },
      };
    }

    return newGame;
  }

  getSurroundingPositions(
    position: Position,
    directions: number[][] = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]
  ): Position[] {
    const { row, col } = position;
    const positions: Position[] = [];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < this.boardSize &&
        newCol >= 0 &&
        newCol < this.boardSize
      ) {
        positions.push({ row: newRow, col: newCol });
      }
    }

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
        // 相手のコマが見つかった場合、さらに先を探索する
        if (piece.type === PieceType.Piece && piece.player !== currentPlayer) {
          tempCaptured.push({ row: x, col: y });
          x += dx;
          y += dy;
          continue;
        }
        // 同じプレイヤーのコマまたは城が見つかった場合、その間のコマを取得する
        // 斜め方向でなければ、壁でも取得する
        else if (
          piece.player === currentPlayer ||
          (!isDiagonal && piece.type === PieceType.Wall)
        ) {
          capturedPositions.push(...tempCaptured);
          break;
        }
        break;
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

    this.checkWinCondition();
    this.currentPlayer = getOpponent(this.currentPlayer);
  }

  checkWinCondition(): void {
    // 勝利条件を満たした場合、this.statusにGameStatus.Finishedを設定し、this.winnerに勝者を設定する
    // 勝利条件: 相手の陣地に3つ以上のコマを配置した場合、または相手のコマを1つ以下にした場合
    const opponent = getOpponent(this.currentPlayer);
    const pieceInOpponentTerritoryCount = this.board.cells
      .flat()
      .filter((cell) => cell.isTerritory[opponent])
      .filter((cell) => cell.piece?.player === this.currentPlayer).length;
    const pieceCount = this.board.cells
      .flat()
      .filter(
        (cell) =>
          cell.piece?.player === opponent && cell.piece.type === PieceType.Piece
      ).length;

    if (pieceInOpponentTerritoryCount >= 3 || pieceCount <= 1) {
      this.status = GameStatus.Finished;
      this.winner = this.currentPlayer;
    }
  }
}
