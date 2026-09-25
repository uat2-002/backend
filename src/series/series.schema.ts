import z from 'zod';

export const UpdateSeriesStatusSchema = z.object({
  seriesId: z.number(),
  status: z.enum(['plan_to_watch', 'watching', 'watched', 'not_worth_it']),
});

export const UpdateEpisodeSchema = z.object({
  seriesId: z.number(),
  episodeId: z.number(),
  isWatched: z.boolean(),
});

export type UpdateSeriesStatusSchema = z.infer<typeof UpdateSeriesStatusSchema>;
export type UpdateEpisodeSchema = z.infer<typeof UpdateEpisodeSchema>;

export const SeasonSummaryResponseSchema = z.object({
  tmdbId: z.number(),
  seasonNumber: z.number(),
  name: z.string(),
  overview: z.string().nullable(),
  poster: z.string().nullable(),
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
  seasons: z.array(SeasonSummaryResponseSchema),
});

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

export const SeasonEpisodesResponseSchema = z.object({
  seasonNumber: z.number(),
  episodes: z.array(EpisodeResponseSchema),
});

export type SeriesDetailsResponse = z.infer<typeof SeriesDetailsResponseSchema>;
export type SeasonEpisodesResponse = z.infer<typeof SeasonEpisodesResponseSchema>;

export const TmdbEpisodeSchema = z.object({
  id: z.number(),
  season_number: z.number(),
  episode_number: z.number(),
  name: z.string(),
  overview: z.string().nullable().optional(),
  still_path: z.string().nullable().optional(),
  air_date: z.string().nullable().optional(),
});

export const TmdbSeasonSchema = z.object({
  id: z.number(),
  season_number: z.number(),
  name: z.string(),
  overview: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  episode_count: z.number().optional(),
});

export const TmdbSeasonWithEpisodesSchema = TmdbSeasonSchema.extend({
  episodes: z.array(TmdbEpisodeSchema),
});

// Update your export type at the bottom:
export type TmdbSeasonWithEpisodesSchema = z.infer<typeof TmdbSeasonWithEpisodesSchema>;

export const TmdbSeriesSchema = z.object({
  id: z.number(),
  name: z.string(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  first_air_date: z.string().nullable().optional(),
  number_of_seasons: z.number().optional(),
  number_of_episodes: z.number().optional(),
  status: z.string(),
  seasons: z.array(TmdbSeasonSchema),
});

export type TmdbSeriesResponseSchema = z.infer<typeof TmdbSeriesSchema>;
