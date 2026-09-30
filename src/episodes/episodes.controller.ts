import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getEpisode } from './episodes.repository.js';
import type { Request, Response } from 'express';
import { updateEpisodeStatus } from './episodes.service.js';

export const episodesRouter = Router();

episodesRouter.post(
  '/user/episodes/:episodeId/status',
  verifyToken,
  async (request: Request, response: Response) => {
    const userEmail = request.userId;
    if (!userEmail) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const episodeId = Number(request.params.episodeId);
    const episode = await getEpisode(episodeId, userEmail);
    if (!episode) {
      return response.status(404).json({ error: 'Episode not found' });
    }
    await updateEpisodeStatus(userEmail, episode);
  }
);
