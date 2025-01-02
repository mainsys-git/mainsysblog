import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, request }) => {
  try {
    // Clear the token cookie
    cookies.delete('token', {
      path: '/',
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response('Internal server error', {
      status: 500,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*'
      }
    });
  }
};
