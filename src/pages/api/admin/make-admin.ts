import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { requireAdminApi } from '../../../middleware/auth';

const prisma = new PrismaClient();

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check admin permissions
    const user = await requireAdminApi(request);
    if (user instanceof Response) return user;

    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }
    
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        role: true
      }
    });

    if (!targetUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    if (targetUser.role === 'ADMIN') {
      return new Response(JSON.stringify({ error: 'User is already an admin' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('Error in make-admin:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal Server Error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } finally {
    await prisma.$disconnect();
  }
};
