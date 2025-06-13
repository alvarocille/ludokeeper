import { CATALOG_API_URL } from "@env";
import axios from "axios";

export interface CatalogGame {
  _id: string;
  name: string;
  description?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playTime?: number;
  yearPublished?: number;
  publisher?: string;
  categories?: string[];
  mechanics?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtener todos los juegos del catálogo con filtros opcionales
 */
export async function getCatalogGames(
  token: string,
  filters: Record<string, string> = {}
): Promise<CatalogGame[]> {
  const res = await axios.get(`${CATALOG_API_URL}/catalog`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters,
  });

  return res.data.data || [];
}

/**
 * Obtener detalles de un juego del catálogo por ID
 */
export async function getCatalogGameById(
  token: string,
  id: string
): Promise<CatalogGame> {
  const res = await axios.get<{ data: CatalogGame }>(
    `${CATALOG_API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
}
