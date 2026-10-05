import { prisma } from '../prisma-client.js';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(email: string, passwordHash: string) {
  return prisma.user.create({
    data: { email, passwordHash },
    select: { email: true },
  });
}

export async function updateRefreshToken(email: string, token: string|null) {
  return prisma.user.update({
    where: { email },
    data: {refreshToken: token}
  });
 };
