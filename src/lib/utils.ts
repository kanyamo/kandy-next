import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Player } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOpponent = (player: Player) =>
  player === Player.Player1 ? Player.Player2 : Player.Player1;
