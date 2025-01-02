import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../../../middleware/auth';

const prisma = new PrismaClient();

export const del: APIRoute = async ({ params, request, cookies }) => {
  try {
    // Verify admin status
    const adminCheck = await verifyAdmin(cookies);
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = params.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if trying to delete self
    const token = cookies.get('token')?.value;
    const currentUser = token ? await prisma.user.findUnique({
      where: { token }
    }) : null;

    if (currentUser?.id === userId) {
      return new Response(JSON.stringify({ error: 'Cannot delete your own account' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await prisma.$disconnect();
  }
};
