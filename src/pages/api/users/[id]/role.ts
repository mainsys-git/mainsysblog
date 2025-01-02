import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { requireAdminApi } from '../../../../middleware/auth';

const prisma = new PrismaClient();

export const post: APIRoute = async ({ params, request }) => {
  try {
    // Verify admin status using the API version
    const adminCheck = await requireAdminApi(request);
    if (adminCheck instanceof Response) {
      return adminCheck;
    }

    const userId = params.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert userId to number
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return new Response(JSON.stringify({ error: 'Invalid user ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { role } = await request.json();
    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Invalid role' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if trying to modify self
    const currentUser = adminCheck;
    if (currentUser.id === userIdNum) {
      return new Response(JSON.stringify({ error: 'Cannot modify your own role' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // First check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userIdNum }
    });

    if (!userExists) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userIdNum },
      data: { role: role as 'USER' | 'ADMIN' }
    });

    return new Response(JSON.stringify({ 
      message: 'Role updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return new Response(JSON.stringify({ error: 'Failed to update user role' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await prisma.$disconnect();
  }
};
