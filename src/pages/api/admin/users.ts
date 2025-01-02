import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { requireAdminApi } from '../../../middleware/auth';

const prisma = new PrismaClient();

export const GET: APIRoute = async ({ request }) => {
  try {
    // Check admin permissions
    const user = await requireAdminApi(request);
    if (user instanceof Response) return user;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: error.message }), {
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
