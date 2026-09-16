import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { Request, Response } from 'express';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const CACHE_FILE = path.join(import.meta.dirname, '..', '.cache', 'movies-cache.json');

interface Movie {
  id: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  description: string;
  rating: number;
  releaseDate: string;
}

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
}

interface CacheEntry {
  data: Movie[];
  fetchedAt: number;
}

function loadCache(): CacheEntry | null {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf-8')) as CacheEntry;
  } catch {
    return null;
  }
}

function saveCache(entry: CacheEntry): void {
  try {
    mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(entry));
  } catch {
    // empty
  }
}

let cache = loadCache();

function parseMaxAge(raw: unknown): number {
  const match = typeof raw === 'string' ? /^(\d+)(h|m|d)?$/.exec(raw.trim()) : null;
  if (!match) return DEFAULT_MAX_AGE_MS;
  const value = Number(match[1]);
  switch (match[2]) {
    case 'm':
      return value * 60_000;
    case 'd':
      return value * 86_400_000;
    default:
      return value * 3_600_000;
  }
}

async function fetchPopularMovies(): Promise<Movie[]> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}`);
  if (!response.ok) {
    throw new Error(`TMDb request failed: ${response.status} ${response.statusText}`);
  }
  const body = (await response.json()) as { results: TmdbMovie[] };
  return body.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
    backdrop: movie.backdrop_path,
    description: movie.overview,
    rating: movie.vote_average,
    releaseDate: movie.release_date,
  }));
}

async function getMovies(maxAgeMs: number): Promise<Movie[]> {
  const cached = cache;
  if (cached && Date.now() - cached.fetchedAt < maxAgeMs) {
    return cached.data;
  }
  const data = await fetchPopularMovies();
  cache = { data, fetchedAt: Date.now() };
  saveCache(cache);
  return data;
}

export async function moviesHandler(request: Request, response: Response): Promise<void> {
  const maxAgeMs = parseMaxAge(request.query.maxAge);
  try {
    response.json(await getMovies(maxAgeMs));
  } catch (error) {
    response.status(502).json({ error: 'Failed to fetch movies from TMDb', details: (error as Error).message });
  }
}
