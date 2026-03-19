import type { Expense, BalanceData, Settlement } from '@/types';

/**
 * Calculates net balance for each user
 * Positive value = user is owed money
 * Negative value = user owes money
 * 
 * Logic:
 * - User who pays gets credited with the full amount (positive)
 * - Each member's share they owe is deducted (negative)
 */
export function calculateBalances(expenses: Expense[]): BalanceData {
  const balances: BalanceData = {};

  expenses.forEach((expense) => {
    // Initialize payer if not exists
    if (!balances[expense.payerId]) {
      balances[expense.payerId] = 0;
    }

    // Add the full amount to the payer (they paid it)
    balances[expense.payerId] += expense.amount;

    // Subtract each member's share from their balance (they owe it)
    expense.members.forEach((member) => {
      if (!balances[member.userId]) {
        balances[member.userId] = 0;
      }
      balances[member.userId] -= member.share;
    });
  });

  return balances;
}

/**
 * Converts balances into settlement transactions
 * 
 * Algorithm:
 * 1. Separate users into creditors (owed money) and debtors (owe money)
 * 2. Match debtors with creditors, settling as much as possible per transaction
 * 3. Return array of settlements needed to make everyone even
 */
export function calculateSettlements(
  balances: BalanceData,
  userMap: Map<number, string>
): Settlement[] {
  const settlements: Settlement[] = [];

  // Create arrays of creditors and debtors
  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0)
    .map(([userId, balance]) => ({
      userId: Number(userId),
      amount: balance,
    }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < 0)
    .map(([userId, balance]) => ({
      userId: Number(userId),
      amount: Math.abs(balance),
    }))
    .sort((a, b) => b.amount - a.amount);

  // Match debtors with creditors
  let creditorIdx = 0;
  let debtorIdx = 0;

  while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
    const creditor = creditors[creditorIdx];
    const debtor = debtors[debtorIdx];

    // Settle as much as possible between this pair
    const settleAmount = Math.min(creditor.amount, debtor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: parseFloat(settleAmount.toFixed(2)),
      names: {
        from: userMap.get(debtor.userId) || 'Unknown',
        to: userMap.get(creditor.userId) || 'Unknown',
      },
    });

    // Update remaining amounts
    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    // Move to next creditor or debtor
    if (creditor.amount === 0) creditorIdx++;
    if (debtor.amount === 0) debtorIdx++;
  }

  return settlements;
}

/**
 * Splits an expense amount equally among members
 * 
 * @param totalAmount - Total expense amount
 * @param memberCount - Number of people splitting the expense
 * @returns Per-person share rounded to 2 decimal places
 */
export function splitExpenseEqually(
  totalAmount: number,
  memberCount: number
): number {
  if (memberCount <= 0) return 0;
  return parseFloat((totalAmount / memberCount).toFixed(2));
}

/**
 * Generates a summary of spending for each person
 * 
 * Returns array of objects containing:
 * - userId: User identifier
 * - totalPaid: Sum of all amounts this user paid
 * - totalOwed: Sum of all shares this user owes
 * - netBalance: totalPaid - totalOwed (positive = owed money, negative = owes money)
 */
export function getSummaryPerPerson(expenses: Expense[]) {
  const summary: {
    [userId: number]: {
      userId: number;
      totalPaid: number;
      totalOwed: number;
      netBalance: number;
    };
  } = {};

  expenses.forEach((expense) => {
    // Add to payer's total paid
    if (!summary[expense.payerId]) {
      summary[expense.payerId] = {
        userId: expense.payerId,
        totalPaid: 0,
        totalOwed: 0,
        netBalance: 0,
      };
    }
    summary[expense.payerId].totalPaid += expense.amount;

    // Add to each member's total owed
    expense.members.forEach((member) => {
      if (!summary[member.userId]) {
        summary[member.userId] = {
          userId: member.userId,
          totalPaid: 0,
          totalOwed: 0,
          netBalance: 0,
        };
      }
      summary[member.userId].totalOwed += member.share;
    });
  });

  // Calculate net balance for each person
  Object.values(summary).forEach((person) => {
    person.netBalance = parseFloat(
      (person.totalPaid - person.totalOwed).toFixed(2)
    );
  });

  return Object.values(summary).sort((a, b) => a.userId - b.userId);
}
