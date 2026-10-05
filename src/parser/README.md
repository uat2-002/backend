# Series parser

Fetches popular TV series from TMDb (`/tv/popular`) and exposes them as `GET /api/series`. Results are cached to disk (`.cache/series-cache.json`) so TMDb is only hit again once the cache is older than `maxAge`.

## Usage

```
GET /api/series?maxAge=12h
```

`maxAge` accepts a number followed by `h` (hours), `m` (minutes), or `d` (days) — e.g. `30m`, `2d`. A bare number is treated as hours. Missing or invalid values default to `12h`. `maxAge=0` always forces a fresh TMDb fetch.

### Examples

```bash
# default (12h cache)
curl http://localhost:3000/api/series

# force a fresh fetch from TMDb
curl "http://localhost:3000/api/series?maxAge=0"

# accept data up to 1 day old
curl "http://localhost:3000/api/series?maxAge=1d"
```

### Response

```json
[
  {
    "id": 91759,
    "title": "Come Home Love: Lo and Behold",
    "poster": "/lgD4j9gUGmMckZpWWRJjorWqGVT.jpg",
    "backdrop": "/dyFTt1a9ZpFdKE96kPlE9fQvXOJ.jpg",
    "description": "...",
    "rating": 5.4,
    "releaseDate": "2017-01-16"
  }
]
```

`poster`/`backdrop` are TMDb image paths — prefix with `https://image.tmdb.org/t/p/w342` (or another size) to load the image.

If TMDb is unreachable or returns an error, the endpoint responds `502` with `{ "error": "...", "details": "..." }`.

## Requirements

`TMDB_API_KEY` must be set in the backend's `.env`.
