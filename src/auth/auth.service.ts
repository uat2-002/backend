import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from './auth.repository.js';
import { HttpError } from '../errors/http-error.js';

const SALT_ROUNDS = 10;

export async function registerUser(email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return createUser(email, passwordHash);
}
