import React from "react";
import { Cell, Player, PieceType } from "@/types";

interface CellProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  onClick: () => void;
}

const CellComponent: React.FC<CellProps> = ({
  cell,
  rowIndex,
  colIndex,
  isSelected,
  onClick,
}) => {
  let content: string;
  let bgColor: string;

  switch (cell?.piece?.type) {
    case PieceType.Wall:
      content = "🧱";
      bgColor = "bg-gray-400";
      break;
    case PieceType.Castle:
      content = "🏰";
      bgColor =
        cell.piece.player === Player.Player1 ? "bg-blue-300" : "bg-red-300";
      break;
    case PieceType.Piece:
      content = "⚪";
      bgColor =
        cell.piece.player === Player.Player1 ? "bg-blue-500" : "bg-red-500";
      break;
    default:
      content = "";
      bgColor = "";
  }

  const isEitherTerritory =
    cell.isTerritory[Player.Player1] || cell.isTerritory[Player.Player2];

  return (
    <div
      className={`w-12 h-12 flex items-center justify-center cursor-pointer bg-white
        ${
          isSelected
            ? "border-4 border-yellow-400"
            : isEitherTerritory
            ? "border-2 border-gray-400"
            : ""
        }
      `}
      onClick={onClick}
    >
      {cell && (
        <div
          className={`w-full h-full flex items-center justify-center ${bgColor}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default CellComponent;
