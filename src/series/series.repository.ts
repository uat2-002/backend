import { prisma } from '../prisma-client.js';
import { mapTmdbStatus } from '../parser/tmdb-helpers.js';
import type { TmdbSeriesResponseSchema } from './series.schema.js';

export const findSeriesDetails = async (seriesId: number) => {
  const series = await prisma.series.findUnique({
    where: {
      tmdbId: seriesId,
    },
    include: {
      seasons: {
        orderBy: {
          seasonNumber: 'asc',
        },
      },
    },
  });
  return series;
};

export const createSeries = async (parsedSeries: TmdbSeriesResponseSchema) => {
  return await prisma.series.create({
    data: {
      tmdbId: parsedSeries.id,
      title: parsedSeries.name,
      backdrop: parsedSeries.backdrop_path,
      firstAirDate: parsedSeries.first_air_date ? new Date(parsedSeries.first_air_date) : null,
      numberOfEpisodes: parsedSeries.number_of_episodes,
      numberOfSeasons: parsedSeries.number_of_seasons,
      overview: parsedSeries.overview,
      poster: parsedSeries.poster_path,
      status: mapTmdbStatus(parsedSeries.status),

      seasons: {
        create: parsedSeries.seasons
          .filter(s => s.season_number > 0)
          .map(s => ({
            tmdbId: s.id,
            seasonNumber: s.season_number,
            name: s.name,
            overview: s.overview,
            poster: s.poster_path,
          })),
      },
    },
    include: {
      seasons: {
        orderBy: {
          seasonNumber: 'asc',
        },
      },
    },
  });
};
