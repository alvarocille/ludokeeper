import { MATCH_API_URL } from '@env';
import axios from 'axios';

export interface Match {
  _id: string;
  userId: string;
  gameId?: string;
  date: string;
  durationMinutes: number;
  players: {
    name: string;
    score: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PlayerResult {
  name: string;
  score: number;
}

export interface CreateMatchDTO {
  date: string;
  durationMinutes: number;
  players: PlayerResult[];
}

interface MatchResponse {
  data: Match[];
}

interface MatchDetailResponse {
  data: Match;
}

export async function getMatches(token: string): Promise<MatchResponse> {
  const res = await axios.get<MatchResponse>(`${MATCH_API_URL}/matches`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getMatchById(token: string, id: string): Promise<MatchDetailResponse> {
  const res = await axios.get<MatchDetailResponse>(`${MATCH_API_URL}/matches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function createMatch(
  token: string,
  matchData: Partial<Omit<Match, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<MatchDetailResponse> {
  const res = await axios.post<MatchDetailResponse>(`${MATCH_API_URL}/matches`, matchData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function updateMatch(
  token: string,
  id: string,
  matchData: Partial<Omit<Match, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<MatchDetailResponse> {
  const res = await axios.put<MatchDetailResponse>(`${MATCH_API_URL}/matches/${id}`, matchData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function deleteMatch(token: string, id: string): Promise<void> {
  await axios.delete(`${MATCH_API_URL}/matches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
