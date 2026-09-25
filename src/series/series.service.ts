import { fetchSeriesDetails } from '../parser/seriesDetails.js';
import { TmdbSeriesSchema, SeriesDetailsResponseSchema } from './series.schema.js';
import type { Series, Season } from '../generated/prisma/client.js';
import { findSeriesDetails, createSeries } from './series.repository.js';

type SeriesWithSeasons = Series & { seasons: Season[] };

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
