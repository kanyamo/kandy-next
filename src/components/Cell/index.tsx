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

  switch (cell?.type) {
    case PieceType.Castle:
      content = "🏰";
      bgColor = cell.player === Player.Player1 ? "bg-blue-300" : "bg-red-300";
      break;
    case PieceType.Piece:
      content = "⚪";
      bgColor = cell.player === Player.Player1 ? "bg-blue-500" : "bg-red-500";
      break;
    default:
      content = "";
      bgColor = "";
  }

  return (
    <div
      className={`w-12 h-12 flex items-center justify-center cursor-pointer bg-white
        ${isSelected ? "border-4 border-yellow-400" : ""}
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
