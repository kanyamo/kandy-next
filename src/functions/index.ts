import { Position } from "@/types";
import { BOARD_SIZE } from "@/constants";

// 周囲のマス一覧を取得する関数
export const getSurroundingPositions = (position: Position): Position[] => {
  const { row, col } = position;
  const positions: Position[] = [];

  // 上下左右
  if (row > 0) positions.push({ row: row - 1, col });
  if (row < BOARD_SIZE - 1) positions.push({ row: row + 1, col });
  if (col > 0) positions.push({ row, col: col - 1 });
  if (col < BOARD_SIZE - 1) positions.push({ row, col: col + 1 });

  // 斜め
  if (row > 0 && col > 0) positions.push({ row: row - 1, col: col - 1 });
  if (row > 0 && col < BOARD_SIZE - 1) positions.push({ row: row - 1, col: col + 1 });
  if (row < BOARD_SIZE - 1 && col > 0) positions.push({ row: row + 1, col: col - 1 });
  if (row < BOARD_SIZE - 1 && col < BOARD_SIZE - 1) positions.push({ row: row + 1, col: col + 1 });

  return positions;
}
