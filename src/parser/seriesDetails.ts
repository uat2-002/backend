import { HttpError } from '../errors/http-error.js';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchSeriesDetails = async (seriesId: number) => {
  const response = await fetch(`${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new HttpError(response.status, 'Series not found');
  }
  const data = await response.json();
  return data;
};

export const fetchSeasonDetails = async (seriesId: number, seasonNumber: number) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
  );
  if (!response.ok) {
    throw new HttpError(response.status, 'Seasons not found');
  }
  const data = await response.json();
  return data;
};
