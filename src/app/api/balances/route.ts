import { NextRequest, NextResponse } from 'next/server';
import { getBalances } from '@/lib/db';

/**
 * GET /api/balances
 * Calculates current balances for all users and generates settlement suggestions
 * 
 * Returns:
 * {
 *   balances: { [userId]: number },
 *   settlements: Array<{ from, to, amount, names }>
 * }
 * 
 * Balance logic:
 * - Positive value = user is owed money
 * - Negative value = user owes money
 * 
 * Settlement logic:
 * - Suggests optimal transactions to settle all debts
 */
export async function GET(request: NextRequest) {
  try {
    const balanceData = await getBalances();

    return NextResponse.json(balanceData, { status: 200 });
  } catch (error) {
    console.error('GET /api/balances error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate balances',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
