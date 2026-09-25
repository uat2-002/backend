import { z } from 'zod';

export const EpisodeResponseSchema = z.object({
  tmdb_id: z.number(),
  seasonNumber: z.number(),
  episodeNum: z.number(),
  title: z.string(),
  overview: z.string().nullable(),
  stillPath: z.string().nullable(),
  airDate: z.string().nullable(),
  isWatched: z.boolean(),
});

export const SeasonResponseSchema = z.object({
  tmdb_id: z.number(),
  seasonNumber: z.number(),
  name: z.string(),
  overview: z.string().nullable(),
  poster: z.string().nullable(),
  episodes: z.array(EpisodeResponseSchema),
});

export const SeriesDetailsResponseSchema = z.object({
  tmdb_id: z.number(),
  title: z.string(),
  poster: z.string().nullable(),
  backdrop: z.string().nullable(),
  overview: z.string().nullable(),
  first_air_date: z.string().nullable(),
  number_of_seasons: z.number().nullable(),
  number_of_episodes: z.number().nullable(),
  status: z.enum(['ongoing', 'ended', 'canceled']),
  seasons: z.array(SeasonResponseSchema),
});

export type SeriesDetailsResponseSchema = z.infer<typeof SeriesDetailsResponseSchema>;
export type EpisodeResponseSchema = z.infer<typeof EpisodeResponseSchema>;
export type SeasonResponseSchema = z.infer<typeof SeasonResponseSchema>;
