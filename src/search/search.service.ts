import { HttpError } from "../errors/http-error.js";
import axios, { isAxiosError} from "axios";

export async function searchSeries(query: string,page: number = 1) {
    const tmdbKey = process.env.TMDB_API_KEY;
    if (!tmdbKey) {
        throw new HttpError(500, 'TMDb key is missing from environment variables');
    }

    const BASE_URL = 'https://api.themoviedb.org/3/search/tv';
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                api_key: tmdbKey,
                query: query,
                language: 'en-US',
                include_adult: false,
                page: page,
            },
            headers: {
                accept: 'application/json',
            },
        });

        return response.data;
    }catch (error) {
    if (isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.status_message || 'Failed to fetch data from TMDb API';
      throw new HttpError(statusCode, message);
    }
    throw new HttpError(500, 'An unexpected error occurred while contacting TMDb');
  }
}