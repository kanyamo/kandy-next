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

    const cell = game.board.cells[row][col];
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
      cell &&
      cell.player === game.currentPlayer &&
      cell.type === PieceType.Piece
    ) {
      // 他のコマを選択する
      newGame.selectedPiece = position;
      setGame(newGame);
    }
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
  );
};

export default GameBoard;
