import type { Prisma } from '../generated/prisma/client.js';
import { toggleEpisodeUnwatched, toggleEpisodeWatched } from './episodes.repository.js';

type EpisodeWithRelations = Prisma.EpisodeGetPayload<{
  include: { watchedBy: true };
}>;

export const updateEpisodeStatus = async (userEmail: string, episode: EpisodeWithRelations) => {
  const seriesId = episode.seriesId;
  const episodeId = episode.tmdbId;
  const isAlreadyWatched = episode.watchedBy.length > 0;
  if (isAlreadyWatched) await toggleEpisodeUnwatched(userEmail, episodeId, seriesId);
  else await toggleEpisodeWatched(userEmail, episodeId, seriesId);
};
