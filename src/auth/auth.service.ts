import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser,updateRefreshToken } from './auth.repository.js';
import { HttpError } from '../errors/http-error.js';
import jwt,  { type JwtPayload} from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
  userId: string;
}

const SALT_ROUNDS = 10;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

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
    const accessToken = jwt.sign({ userId: user.email }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
    await updateRefreshToken(user.email, refreshToken);
  return { accessToken, refreshToken };
}

export async function refreshSession(clientRefreshToken: string) { 
  try {
    const decoded = jwt.verify(clientRefreshToken, REFRESH_SECRET) as TokenPayload;
    const userEmail = decoded.userId;

    const user = await findUserByEmail(userEmail);

    if (!user || user.refreshToken !== clientRefreshToken) {
      throw new HttpError(401, 'Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ userId: user.email }, ACCESS_SECRET, { expiresIn: '15m' });
    
    return { accessToken: newAccessToken };
  } catch {
    throw new HttpError(401, 'Invalid refresh token');
  }
}

export async function logoutUser(userEmail: string) {
  await updateRefreshToken(userEmail, null);
}