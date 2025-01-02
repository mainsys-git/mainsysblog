import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { APIContext } from 'astro';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getUserFromToken(token: string | null) {
  if (!token) {
    console.log('No token provided');
    return null;
  }
  
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    console.log('Token decoded:', { userId: decoded.userId });
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });
    
    console.log('User found:', user ? { id: user.id, role: user.role } : 'no user');
    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function checkAdminRole(context: APIContext) {
  const token = context.cookies.get('token')?.value;
  console.log('Token from cookies:', token ? 'exists' : 'missing');
  
  const user = await getUserFromToken(token);
  console.log('User from checkAdminRole:', user ? { id: user.id, role: user.role } : 'no user');
  
  if (!user || user.role !== 'ADMIN') {
    console.log('User not authorized');
    return null;
  }
  
  return user;
}
