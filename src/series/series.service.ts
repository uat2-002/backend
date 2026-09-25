import { fetchSeasonDetails, fetchSeriesDetails } from '../parser/seriesDetails.js';
import {
  TmdbSeriesSchema,
  SeriesDetailsResponseSchema,
  TmdbSeasonWithEpisodesSchema,
} from './series.schema.js';
import type { Series, Season, Episode } from '../generated/prisma/client.js';
import {
  findSeriesDetails,
  createSeries,
  findSeasonDetails,
  createSeasonWithEpisodes,
} from './series.repository.js';
import { HttpError } from '../errors/http-error.js';

type SeriesWithSeasons = Series & { seasons: Season[] };
type SeasonWithEpisodes = Season & { episodes: Episode[] };

export const getOrSyncSeries = async (seriesId: number): Promise<SeriesWithSeasons> => {
  let series = await findSeriesDetails(seriesId);
  if (series) return series;

  const rawTmdbSeries = await fetchSeriesDetails(seriesId);
  const parsedSeries = TmdbSeriesSchema.parse(rawTmdbSeries);

  series = await createSeries(parsedSeries);

  return series;
};

export const makeSeriesPayload = (seriesDetails: SeriesWithSeasons) => {
  const seriesPayload = {
    tmdbId: seriesDetails.tmdbId,
    title: seriesDetails.title,
    poster: seriesDetails.poster,
    backdrop: seriesDetails.backdrop,
    overview: seriesDetails.overview,
    firstAirDate: seriesDetails.firstAirDate ? seriesDetails.firstAirDate.toISOString() : null,
    numberOfSeasons: seriesDetails.numberOfSeasons,
    numberOfEpisodes: seriesDetails.numberOfEpisodes,
    status: seriesDetails.status,
    seasons: seriesDetails.seasons.map(season => ({
      tmdbId: season.tmdbId,
      seasonNumber: season.seasonNumber,
      name: season.name,
      overview: season.overview,
      poster: season.poster,
    })),
  };
  return SeriesDetailsResponseSchema.parse(seriesPayload);
};

export const getOrSyncSeasonEpisodes = async (
  seriesId: number,
  seasonNumber: number
): Promise<SeasonWithEpisodes> => {
  let seasonWithEpisodes = await findSeasonDetails(seriesId, seasonNumber);
  if (seasonWithEpisodes && seasonWithEpisodes.episodes.length > 0) return seasonWithEpisodes;

  await getOrSyncSeries(seriesId);

  const rawTmdbSeason = await fetchSeasonDetails(seriesId, seasonNumber);
  const parsedSeason = TmdbSeasonWithEpisodesSchema.parse(rawTmdbSeason);

  await createSeasonWithEpisodes(parsedSeason, seriesId);
  seasonWithEpisodes = await findSeasonDetails(seriesId, seasonNumber);
  if (!seasonWithEpisodes) {
    throw new HttpError(404, 'User or Series not found in database');
  }

  return seasonWithEpisodes;
};

export const makeSeasonWithEpisodesPayload = (seasonWithEpisodes: SeasonWithEpisodes) => {
  const seasonWithEpisodesPayload = {
    tmdbId: seasonWithEpisodes.tmdbId,
    seasonNumber: seasonWithEpisodes.seasonNumber,
    name: seasonWithEpisodes.name,
    overview: seasonWithEpisodes.overview,
    poster: seasonWithEpisodes.poster,
    episodes: seasonWithEpisodes.episodes.map(episode => ({
      tmdbId: episode.tmdbId,
      seasonNumber: episode.seasonNumber,
      episodeNumber: episode.episodeNum,
      title: episode.title,
      overview: episode.overview,
      stillPath: episode.stillPath,
      airDate: episode.airDate ? episode.airDate.toISOString() : null,
    })),
  };
  return seasonWithEpisodesPayload;
};
