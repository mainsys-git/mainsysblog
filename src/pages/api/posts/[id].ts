import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { requireAdminApi } from '../../../middleware/auth';

const prisma = new PrismaClient();

// Add OPTIONS handler for CORS preflight
export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  });
};

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Post ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
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

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // Check admin permissions
    const user = await requireAdminApi(request);
    if (user instanceof Response) return user;

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    const body = await request.json();
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
      },
    });

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('Error in PUT /api/posts/[id]:', error);
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
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

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    // Check admin permissions
    const user = await requireAdminApi(request);
    if (user instanceof Response) return user;

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    const body = await request.json();
    console.log('PATCH request body:', body);
    console.log('PATCH request params:', params);

    // Get the current post first
    const currentPost = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentPost) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    console.log('Current post state:', {
      id: currentPost.id,
      published: currentPost.published,
      archived: currentPost.archived
    });

    // Prepare update data
    const updateData: Record<string, any> = {};
    
    if ('publish' in body) {
      updateData.published = Boolean(body.publish);
      console.log('Setting published to:', updateData.published);
    }
    
    if ('archive' in body) {
      updateData.archived = Boolean(body.archive);
      console.log('Setting archived to:', updateData.archived);
    }

    if (Object.keys(updateData).length === 0) {
      console.log('No valid update fields found in request body');
      return new Response(JSON.stringify({ error: 'No valid update fields provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    console.log('Update data:', updateData);

    // Update the post using Prisma
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    console.log('Updated post:', {
      id: post.id,
      published: post.published,
      archived: post.archived
    });

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('Error in PATCH /api/posts/[id]:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update post',
      details: error instanceof Error ? error.message : 'Unknown error'
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

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    // Check admin permissions
    const user = await requireAdminApi(request);
    if (user instanceof Response) return user;

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('Error in DELETE /api/posts/[id]:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
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
