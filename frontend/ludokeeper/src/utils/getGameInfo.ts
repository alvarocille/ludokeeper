import { Game } from "src/components/games/GameCard";

export interface GameInfo {
  name: string;
  description?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playTime?: number;
  imageUrl?: string;
  yearPublished?: number;
  publisher?: string;
  categories?: string[];
  mechanics?: string[];
}

export function getGameInfo(game: Game): GameInfo {
  const data = game.source === "custom" ? game.customData : game.gameId;

  return {
    name: data?.name || "Juego sin datos",
    description: data?.description,
    minPlayers: data?.minPlayers,
    maxPlayers: data?.maxPlayers,
    playTime: data?.playTime,
    imageUrl: data?.imageUrl,
    yearPublished: (data as any)?.yearPublished,
    publisher: (data as any)?.publisher,
    categories: (data as any)?.categories,
    mechanics: (data as any)?.mechanics,
  };
}
