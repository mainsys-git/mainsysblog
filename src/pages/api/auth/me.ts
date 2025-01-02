import type { APIRoute } from 'astro';
import { getUserFromToken } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies, request }) => {
  try {
    const token = cookies.get('token')?.value;
    console.log('Token from cookies:', token ? 'exists' : 'missing');

    if (!token) {
      return new Response('Unauthorized', { 
        status: 401,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*'
        }
      });
    }

    const user = await getUserFromToken(token);
    console.log('User from token:', user ? { id: user.id, role: user.role } : 'no user');

    if (!user) {
      return new Response('Unauthorized', { 
        status: 401,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*'
        }
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*'
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*'
      }
    });
  }
};
