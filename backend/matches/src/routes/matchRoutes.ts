import { FastifyInstance } from 'fastify';
import {
  createMatchHandler,
  getMatchesHandler,
  getMatchByIdHandler,
  updateMatchHandler,
  deleteMatchHandler
} from '../controllers/matchController';
import { authenticate } from '../utils/auth';

export default async function matchRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/matches', createMatchHandler);
  app.get('/matches', getMatchesHandler);
  app.get('/matches/:id', getMatchByIdHandler);
  app.put('/matches/:id', updateMatchHandler);
  app.delete('/matches/:id', deleteMatchHandler);
}
