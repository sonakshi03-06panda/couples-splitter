import { prisma } from '@/lib/prisma';
import { calculateBalances, calculateSettlements } from '@/lib/expenses';
import type { Expense, ExpenseMember, User } from '@/types';

/**
 * Creates a new expense with associated members
 * 
 * @param data - Expense data including amount, category, date, payerId, and members array
 * @param data.amount - Total expense amount
 * @param data.category - Expense category
 * @param data.date - Expense date
 * @param data.payerId - User ID of person who paid
 * @param data.members - Array of {userId, share} objects
 * @returns Created expense with member details
 * @throws Error if database operation fails
 */
export async function createExpense(data: {
  amount: number;
  category: string;
  date: Date;
  payerId: number;
  members: { userId: number; share: number }[];
}): Promise<Expense> {
  try {
    const expense = await prisma.expense.create({
      data: {
        amount: data.amount,
        category: data.category,
        date: data.date,
        payerId: data.payerId,
        members: {
          create: data.members,
        },
      },
      include: {
        payer: true,
        members: true,
      },
    });

    return {
      id: expense.id,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      payerId: expense.payerId,
      createdAt: expense.createdAt,
      members: expense.members,
    };
  } catch (error) {
    console.error('Error creating expense:', error);
    throw new Error(
      `Failed to create expense: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetches all expenses with complete payer and member information
 * 
 * @returns Array of expenses with payer and member details
 * @throws Error if database query fails
 */
export async function getAllExpenses(): Promise<Expense[]> {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        payer: true,
        members: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return expenses.map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      payerId: expense.payerId,
      createdAt: expense.createdAt,
      members: expense.members,
    }));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw new Error(
      `Failed to fetch expenses: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Calculates current balances and settlement suggestions for all users
 * 
 * Logic:
 * - Fetches all expenses and members
 * - Calculates who owes whom
 * - Generates optimal settlement transactions
 * 
 * @returns Object containing balances and settlements
 * @throws Error if calculation fails
 */
export async function getBalances() {
  try {
    const expenses = await getAllExpenses();
    const users = await getAllUsers();

    // Create map of userId to userName for settlement display
    const userMap = new Map<number, string>();
    users.forEach((user) => {
      userMap.set(user.id, user.name);
    });

    // Calculate balances (positive = owed, negative = owes)
    const balances = calculateBalances(expenses);

    // Calculate settlement suggestions
    const settlements = calculateSettlements(balances, userMap);

    return {
      balances,
      settlements,
    };
  } catch (error) {
    console.error('Error calculating balances:', error);
    throw new Error(
      `Failed to calculate balances: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Deletes an expense and all associated expense members
 * 
 * Note: Cascade delete is configured in schema.prisma for ExpenseMember
 * 
 * @param id - Expense ID to delete
 * @returns Deleted expense data
 * @throws Error if expense not found or deletion fails
 */
export async function deleteExpense(id: number): Promise<void> {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error(`Expense with ID ${id} not found`);
    }

    await prisma.expense.delete({
      where: { id },
    });

    console.log(`Successfully deleted expense ID ${id}`);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error(
      `Failed to delete expense: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetches all users in the system
 * 
 * @returns Array of all users
 * @throws Error if database query fails
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(
      `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Creates a new user
 * 
 * @param name - User's name
 * @param email - User's email (must be unique)
 * @param color - Hex color code for user identification
 * @returns Created user object
 * @throws Error if email already exists or database operation fails
 */
export async function createUser(
  name: string,
  email: string,
  color: string
): Promise<User> {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        color,
      },
    });

    console.log(`Created new user: ${user.name} (${user.email})`);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(
      `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
