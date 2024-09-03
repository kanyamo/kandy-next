"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// 先ほど定義したインターフェースとenumをインポート
// 実際の実装では、これらを別のファイルに定義し、インポートする必要があります
import {
  Player,
  GameStatus,
  GamePiece,
  Castle,
  Position,
  Cell,
  Board,
  Game,
} from "@/types";
import { BOARD_SIZE } from "@/constants";
import { getSurroundingPositions } from "@/functions";

const GameBoard: React.FC = () => {
  const [game, setGame] = useState<Game>({
    board: {
      cells: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null)),
    },
    currentPlayer: Math.random() < 0.5 ? Player.Player1 : Player.Player2,
    status: GameStatus.Playing,
    selectedPiece: null,
    winner: null,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    initializeBoard();
  }, []);

  useEffect(() => {
    if (isClient) {
      // クライアントサイドでのみランダムなプレイヤーを設定
      setGame((prevGame) => ({
        ...prevGame,
        currentPlayer: Math.random() < 0.5 ? Player.Player1 : Player.Player2,
      }));
    }
  }, [isClient]);

  const initializeBoard = () => {
    const newBoard: Board = {
      cells: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null)),
    };

    // Player1の初期配置
    newBoard.cells[0][4] = { type: "castle", player: Player.Player1 };
    for (const position of getSurroundingPositions({ row: 0, col: 4 })) {
      newBoard.cells[position.row][position.col] = {
        type: "piece",
        player: Player.Player1,
      };
    }

    // Player2の初期配置
    newBoard.cells[8][4] = { type: "castle", player: Player.Player2 };
    for (const position of getSurroundingPositions({ row: 8, col: 4 })) {
      newBoard.cells[position.row][position.col] = {
        type: "piece",
        player: Player.Player2,
      };
    }

    setGame((prevGame) => ({ ...prevGame, board: newBoard }));
  };

  const handleCellClick = (row: number, col: number) => {
    if (game.status !== GameStatus.Playing) return;

    const cell = game.board.cells[row][col];

    if (game.selectedPiece) {
      if (isValidMove(game.selectedPiece, row, col)) {
        movePiece(game.selectedPiece, row, col);
      }
      setGame((prevGame) => ({ ...prevGame, selectedPiece: null }));
    } else if (
      cell &&
      cell.player === game.currentPlayer &&
      cell.type === "piece"
    ) {
      setGame((prevGame) => ({ ...prevGame, selectedPiece: { row, col } }));
    }
  };

  const isValidMove = (
    from: Position,
    toRow: number,
    toCol: number
  ): boolean => {
    if (Math.abs(from.row - toRow) > 1 || Math.abs(from.col - toCol) > 1)
      return false;
    if (game.board.cells[toRow][toCol] !== null) return false;
    return true;
  };

  const movePiece = (
    from: { row: number; col: number },
    toRow: number,
    toCol: number
  ) => {
    const newBoard: Board = {
      cells: game.board.cells.map((row) => [...row]),
    };
    const piece = newBoard.cells[from.row][from.col];
    newBoard.cells[from.row][from.col] = null;
    newBoard.cells[toRow][toCol] = piece;

    const capturedPieces = checkCaptures(toRow, toCol);
    capturedPieces.forEach(({ row, col }) => {
      newBoard.cells[row][col] = null;
    });

    setGame((prevGame) => ({
      ...prevGame,
      board: newBoard,
      currentPlayer:
        capturedPieces.length === 0
          ? prevGame.currentPlayer === Player.Player1
            ? Player.Player2
            : Player.Player1
          : prevGame.currentPlayer,
    }));

    checkWinCondition();
  };

  const checkCaptures = (
    row: number,
    col: number
  ): { row: number; col: number }[] => {
    // 簡略化のため、キャプチャーのロジックは省略しています
    return [];
  };

  const checkWinCondition = () => {
    // 簡略化のため、勝利条件のチェックは省略しています
  };

  const renderCell = (cell: Cell, rowIndex: number, colIndex: number) => {
    if (!cell) return null;

    let content: string;
    let bgColor: string;

    if (cell.type === "castle") {
      content = "🏰";
      bgColor = cell.player === Player.Player1 ? "bg-blue-300" : "bg-red-300";
    } else {
      content = "⚪";
      bgColor = cell.player === Player.Player1 ? "bg-blue-500" : "bg-red-500";
    }

    return (
      <div
        className={`w-full h-full flex items-center justify-center ${bgColor}`}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            Current Player:{" "}
            {game.currentPlayer === Player.Player1 ? "Player 1" : "Player 2"}
          </AlertTitle>
          <AlertDescription>Game Status: {game.status}</AlertDescription>
        </Alert>
      </div>
      <div className="grid grid-cols-9 gap-1 bg-gray-300 p-2">
        {game.board.cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 flex items-center justify-center cursor-pointer bg-white
                ${
                  game.selectedPiece &&
                  game.selectedPiece.row === rowIndex &&
                  game.selectedPiece.col === colIndex
                    ? "border-4 border-yellow-400"
                    : ""
                }
              `}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {renderCell(cell, rowIndex, colIndex)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
