import { prisma } from '../prisma-client.js';

export async function addSeriesToUser(userEmail: string, tmdbId: number) { 
    return prisma.userSeries.create({
        data: {
            userEmail: userEmail,
            seriesId: tmdbId
        }
    });
}