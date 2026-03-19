import { NextRequest, NextResponse } from 'next/server';
import { deleteExpense } from '@/lib/db';

/**
 * DELETE /api/expenses/[id]
 * Deletes an expense by ID
 * 
 * URL params:
 * - id: number - The expense ID to delete
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validation: ensure ID is provided and is a valid number
    if (!id) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: ['id parameter is required'],
        },
        { status: 400 }
      );
    }

    const expenseId = parseInt(id, 10);
    if (isNaN(expenseId) || expenseId <= 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: ['id must be a valid positive number'],
        },
        { status: 400 }
      );
    }

    // Delete expense
    await deleteExpense(expenseId);

    return NextResponse.json(
      {
        success: true,
        message: `Expense with ID ${expenseId} deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/expenses/[id] error:', error);

    // Handle specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if it's a "not found" error
    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Not found',
          message: errorMessage,
        },
        { status: 404 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Failed to delete expense',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
