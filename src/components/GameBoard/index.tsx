"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Player, GameStatus, IGame, PieceType } from "@/types";
import { GridGame } from "@/lib/gridGame";
import { BOARD_SIZE } from "@/constants";
import CellComponent from "../Cell";

const GameBoard: React.FC = () => {
  const [game, setGame] = useState<IGame>(GridGame.initialize(BOARD_SIZE));

  const handleCellClick = (row: number, col: number) => {
    if (game.status !== GameStatus.Playing) return;

    const piece = game.board.cells[row][col].piece;
    const position = { row, col };
    const newGame = game.copy();

    if (game.selectedPiece) {
      // 移動先が有効な場合、コマを移動する
      if (newGame.isValidMove(game.selectedPiece, position)) {
        newGame.movePiece(game.selectedPiece, position);
      }
      newGame.selectedPiece = null;
      setGame(newGame);
    } else if (
      piece &&
      piece.player === game.currentPlayer &&
      piece.type === PieceType.Piece
    ) {
      // 他のコマを選択する
      newGame.selectedPiece = position;
      setGame(newGame);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100">
      <div className="mb-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {game.winner
              ? `Player ${game.winner === Player.Player1 ? "1" : "2"}の勝利`
              : `現在の手番: ${
                  game.currentPlayer === Player.Player1
                    ? "Player 1"
                    : "Player 2"
                }`}
          </AlertTitle>
          <AlertDescription>ステータス: {game.status}</AlertDescription>
        </Alert>
      </div>
      <div className="w-full max-w-[90vmin] aspect-square">
        <div
          className="grid gap-1 bg-gray-300 p-2 w-full h-full"
          style={{ gridTemplateColumns: `repeat(${game.boardSize}, 1fr)` }}
        >
          {game.board.cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <CellComponent
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                rowIndex={rowIndex}
                colIndex={colIndex}
                isSelected={
                  game.selectedPiece?.row === rowIndex &&
                  game.selectedPiece?.col === colIndex
                }
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
