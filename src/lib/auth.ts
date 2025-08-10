import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export interface JWTPayload {
  userId: string
  username: string
  email: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) return null
    
    return verifyToken(token)
  } catch (error) {
    return null
  }
}