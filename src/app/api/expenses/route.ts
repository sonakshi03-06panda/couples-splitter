import { NextRequest, NextResponse } from 'next/server';
import { getAllExpenses, createExpense } from '@/lib/db';

/**
 * GET /api/expenses
 * Fetches all expenses with payer and member details
 */
export async function GET() {
  try {
    const expenses = await getAllExpenses();
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('GET /api/expenses error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch expenses',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * Creates a new expense with expense members
 * 
 * Request body:
 * {
 *   amount: number,
 *   category: string,
 *   date: string (ISO 8601),
 *   payerId: number,
 *   members: Array<{ userId: number, share: number }>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const errors: string[] = [];

    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      errors.push('amount must be a positive number');
    }

    if (!body.category || typeof body.category !== 'string' || body.category.trim() === '') {
      errors.push('category must be a non-empty string');
    }

    if (!body.date || typeof body.date !== 'string') {
      errors.push('date must be a valid ISO 8601 date string');
    }

    if (!body.payerId || typeof body.payerId !== 'number') {
      errors.push('payerId must be a valid number');
    }

    if (!Array.isArray(body.members) || body.members.length === 0) {
      errors.push('members must be a non-empty array');
    }

    // Validate members array
    if (Array.isArray(body.members)) {
      body.members.forEach((member: {userId: number; share: number}, index: number) => {
        if (typeof member.userId !== 'number') {
          errors.push(`members[${index}].userId must be a number`);
        }
        if (typeof member.share !== 'number' || member.share <= 0) {
          errors.push(`members[${index}].share must be a positive number`);
        }
      });
    }

    // Validate share amounts sum roughly to expense amount
    if (Array.isArray(body.members) && body.members.length > 0) {
      const totalShares = body.members.reduce(
        (sum: number, m: {userId: number; share: number}) => sum + (m.share || 0),
        0
      );
      const difference = Math.abs(totalShares - body.amount);
      
      // Allow small rounding differences (0.01)
      if (difference > 0.01) {
        errors.push(
          `sum of shares (${totalShares.toFixed(2)}) must equal expense amount (${body.amount.toFixed(2)})`
        );
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

    // Parse date
    const expenseDate = new Date(body.date);
    if (isNaN(expenseDate.getTime())) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: ['date must be a valid ISO 8601 date'],
        },
        { status: 400 }
      );
    }

    // Create expense
    const expense = await createExpense({
      amount: body.amount,
      category: body.category.trim(),
      date: expenseDate,
      payerId: body.payerId,
      members: body.members,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('POST /api/expenses error:', error);

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

    return NextResponse.json(
      {
        error: 'Failed to create expense',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
