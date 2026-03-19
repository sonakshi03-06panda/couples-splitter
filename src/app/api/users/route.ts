import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/db';

/**
 * GET /api/users
 * Fetches all users in the system
 */
export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Creates a new user
 * 
 * Request body:
 * {
 *   name: string,
 *   email: string,
 *   color: string (hex color code)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const errors: string[] = [];

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      errors.push('name must be a non-empty string');
    }

    if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
      errors.push('email must be a non-empty string');
    }

    // Basic email format validation
    if (body.email && typeof body.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        errors.push('email must be a valid email format');
      }
    }

    if (!body.color || typeof body.color !== 'string' || body.color.trim() === '') {
      errors.push('color must be a non-empty string');
    }

    // Validate hex color format (optional but recommended)
    if (body.color && typeof body.color === 'string') {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!colorRegex.test(body.color)) {
        errors.push('color must be a valid hex color code (e.g., #FF5733)');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(
      body.name.trim(),
      body.email.trim().toLowerCase(),
      body.color
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);

    // Handle specific error cases
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for duplicate email error
    if (errorMessage.includes('already exists')) {
      return NextResponse.json(
        {
          error: 'Conflict',
          message: errorMessage,
        },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Failed to create user',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
