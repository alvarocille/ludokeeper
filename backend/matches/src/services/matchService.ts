import { Match } from '../models/matchModel';

export async function createMatch(userId: string, data: any) {
  const newMatch = new Match({
    userId,
    ...data,
  });
  return await newMatch.save();
}

export async function getAllMatches(userId: string) {
  return await Match.find({ userId });
}

export async function getMatchById(userId: string, matchId: string) {
  return await Match.findOne({ _id: matchId, userId });
}

export async function updateMatch(userId: string, matchId: string, data: any) {
  return await Match.findOneAndUpdate(
    { _id: matchId, userId },
    data,
    { new: true }
  );
}

export async function deleteMatch(userId: string, matchId: string) {
  const result = await Match.deleteOne({ _id: matchId, userId });
  return result.deletedCount > 0;
}
