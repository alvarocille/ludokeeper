import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  getMatchById,
  updateMatch
} from '../services/matchService';

export async function createMatchHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log("🟢 createMatchHandler - body:", request.body);
    const match = await createMatch(request.user.id, request.body);
    return reply.code(201).send({ data: match });
  } catch (error) {
    console.log('🔴 Error en createMatchHandler:', error);
    return reply.code(500).send({ message: 'Error creating match' });
  }
}



export async function getMatchesHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const matches = await getAllMatches(request.user.id);
    return reply.send({ data: matches });
  } catch (error) {
    return reply.code(500).send({ message: 'Error fetching matches' });
  }
}

export async function getMatchByIdHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const match = await getMatchById(request.user.id, id);

    if (!match) {
      return reply.code(404).send({ message: 'Match not found' });
    }

    return reply.send({ data: match });
  } catch (error) {
    return reply.code(500).send({ message: 'Error fetching match' });
  }
}

export async function updateMatchHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const updated = await updateMatch(request.user.id, id, request.body);

    if (!updated) {
      return reply.code(404).send({ message: 'Match not found or not yours' });
    }

    return reply.send({ data: updated });
  } catch (error) {
    return reply.code(500).send({ message: 'Error updating match' });
  }
}

export async function deleteMatchHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const deleted = await deleteMatch(request.user.id, id);

    if (!deleted) {
      return reply.code(404).send({ message: 'Match not found or not yours' });
    }

    return reply.code(204).send();
  } catch (error) {
    return reply.code(500).send({ message: 'Error deleting match' });
  }
}
