import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const POST: APIRoute = async ({ params, request }) => {
  const { action } = params;

  try {
    const data = await request.json();

    if (action === 'register') {
      try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            role: 'USER',
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        const token = jwt.sign({ 
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }, JWT_SECRET);

        return new Response(JSON.stringify({ token, user }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Registration error:', error);
        return new Response(JSON.stringify({ error: 'Registration failed. Email might already be in use.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (action === 'login') {
      try {
        const user = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!user) {
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) {
          return new Response(JSON.stringify({ error: 'Invalid password' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const token = jwt.sign({ 
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }, JWT_SECRET);

        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        return new Response(JSON.stringify({ token, user: userData }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ error: 'Login failed' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Request parsing error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
