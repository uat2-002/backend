import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from './auth.repository.js';
import { HttpError } from '../errors/http-error.js';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export async function registerUser(email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return createUser(email, passwordHash);
}

export async function loginUser(email: string, password: string) {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new HttpError(401, 'Authentication failed');
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new HttpError(401, 'Authentication failed');
    }
    const accessToken = jwt.sign({ userId: user.email}, 'your-secret-key', {
 expiresIn: '24h',
    });
  return { accessToken };
}