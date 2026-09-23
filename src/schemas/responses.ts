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

export const SeasonResponseSchema = z.object({
  tmdbId: z.number(),
  seasonNumber: z.number(),
  name: z.string(),
  overview: z.string().nullable(),
  poster: z.string().nullable(),
  episodes: z.array(EpisodeResponseSchema),
});

export const SeriesDetailsResponseSchema = z.object({
  tmdbId: z.number(),
  title: z.string(),
  poster: z.string().nullable(),
  backdrop: z.string().nullable(),
  overview: z.string().nullable(),
  firstAirDate: z.string().nullable(),
  numberOfSeasons: z.number().nullable(),
  numberOfEpisodes: z.number().nullable(),
  status: z.enum(['ongoing', 'ended', 'canceled']),
  seasons: z.array(SeasonResponseSchema),
});