import { z } from 'zod';

export const EpisodeResponseSchema = z.object({
  tmdbId: z.number(),
  seasonNumber: z.number(),
  episodeNum: z.number(),
  title: z.string(),
  overview: z.string().nullable(),
  stillPath: z.string().nullable(),
  airDate: z.string().nullable(),
  isWatched: z.boolean(),
});

export const UpdateEpisodeStatusSchema = z.object({
  isWatched: z.boolean(),
});
