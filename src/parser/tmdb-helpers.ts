import type { SeriesStatus } from '../generated/prisma/index.js';

export function mapTmdbStatus(status: string): SeriesStatus {
  const lowered = status.toLowerCase();
  if (lowered.includes('ended')) {
    return 'ended';
  }
  if (lowered.includes('cancel')) {
    return 'canceled';
  }
  return 'ongoing';
}
