import { INVENTORY_API_URL } from "@env";
import axios from "axios";
import { Game } from "src/components/games/GameCard";

export type CreateGameDTO =
  | {
      source: "custom";
      customData: {
        name: string;
        description?: string;
        minPlayers?: number;
        maxPlayers?: number;
        playTime?: number;
        imageUrl?: string;
      };
      acquisitionDate?: string;
      notes?: string;
    }
  | {
      source: "catalog";
      gameId: string;
      acquisitionDate?: string;
      notes?: string;
    };


export interface UpdateGameDTO {
  customData?: {
    name?: string;
    description?: string;
    minPlayers?: number;
    maxPlayers?: number;
    playTime?: number;
    imageUrl?: string;
  };
  acquisitionDate?: string;
  notes?: string;
}

export async function getUserGames(
  token: string,
  filters: Record<string, string>,
): Promise<Game[]> {
  const query = new URLSearchParams(filters).toString();
  const url = query
    ? `${INVENTORY_API_URL}/inventory?${query}`
    : `${INVENTORY_API_URL}/inventory`;

    console.log("Llamando a getUserGames con URL:", url);
  const res = await axios.get<{ data: Game[] }>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data || [];
}

export async function deleteGame(token: string, id: string): Promise<void> {
  await axios.delete(`${INVENTORY_API_URL}/inventory/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateGame(
  token: string,
  id: string,
  data: UpdateGameDTO,
): Promise<Game> {
  const res = await axios.put<{ data: Game }>(
    `${INVENTORY_API_URL}/inventory/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.data;
}

export async function addGame(
  token: string,
  data: CreateGameDTO,
): Promise<Game> {
  const res = await axios.post<{ data: Game }>(
    `${INVENTORY_API_URL}/inventory`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.data;
}


