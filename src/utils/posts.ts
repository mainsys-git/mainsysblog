import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          archived: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ],
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export async function createPost(data: any) {
  try {
    const post = await prisma.post.create({
      data
    });
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updatePost(id: number, data: any) {
  try {
    const post = await prisma.post.update({
      where: {
        id
      },
      data
    });
    return post;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deletePost(id: number) {
  try {
    await prisma.post.delete({
      where: {
        id
      }
    });
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
