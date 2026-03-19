import {
  calculateBalances,
  calculateSettlements,
  splitExpenseEqually,
  getSummaryPerPerson,
} from '@/lib/expenses';
import type { Expense, ExpenseMember } from '@/types';

describe('Expense Calculation Functions', () => {
  // Sample data for testing
  const mockExpenses: Expense[] = [
    {
      id: 1,
      amount: 100,
      category: 'Food',
      date: '2024-01-15',
      payerId: 1,
      createdAt: '2024-01-15',
      members: [
        { id: 1, expenseId: 1, userId: 1, share: 50 },
        { id: 2, expenseId: 1, userId: 2, share: 50 },
      ],
    },
    {
      id: 2,
      amount: 60,
      category: 'Entertainment',
      date: '2024-01-16',
      payerId: 2,
      createdAt: '2024-01-16',
      members: [
        { id: 3, expenseId: 2, userId: 1, share: 30 },
        { id: 4, expenseId: 2, userId: 2, share: 30 },
      ],
    },
  ];

  describe('calculateBalances', () => {
    it('should calculate correct balances for simple case', () => {
      const balances = calculateBalances(mockExpenses);

      // User 1: paid 100, owes 50 + 30 = 80 → balance = 100 - 80 = 20
      expect(balances[1]).toBe(20);

      // User 2: paid 60, owes 50 + 30 = 80 → balance = 60 - 80 = -20
      expect(balances[2]).toBe(-20);
    });

    it('should return empty object for empty expenses', () => {
      const balances = calculateBalances([]);

      expect(balances).toEqual({});
    });

    it('should handle single payer scenario', () => {
      const singleExpense: Expense[] = [
        {
          id: 1,
          amount: 100,
          category: 'Food',
          date: '2024-01-15',
          payerId: 1,
          createdAt: '2024-01-15',
          members: [
            { id: 1, expenseId: 1, userId: 2, share: 100 },
          ],
        },
      ];

      const balances = calculateBalances(singleExpense);

      // User 1 paid 100, owes 0 → balance = 100
      expect(balances[1]).toBe(100);

      // User 2 paid 0, owes 100 → balance = -100
      expect(balances[2]).toBe(-100);
    });

    it('should handle multiple expenses correctly', () => {
      const multipleExpenses: Expense[] = [
        {
          id: 1,
          amount: 300,
          category: 'Rent',
          date: '2024-01-01',
          payerId: 1,
          createdAt: '2024-01-01',
          members: [
            { id: 1, expenseId: 1, userId: 1, share: 150 },
            { id: 2, expenseId: 1, userId: 2, share: 150 },
          ],
        },
        {
          id: 2,
          amount: 50,
          category: 'Groceries',
          date: '2024-01-02',
          payerId: 2,
          createdAt: '2024-01-02',
          members: [
            { id: 3, expenseId: 2, userId: 1, share: 25 },
            { id: 4, expenseId: 2, userId: 2, share: 25 },
          ],
        },
      ];

      const balances = calculateBalances(multipleExpenses);

      // User 1: paid 300, owes 150 + 25 = 175 → balance = 125
      expect(balances[1]).toBe(125);

      // User 2: paid 50, owes 150 + 25 = 175 → balance = -125
      expect(balances[2]).toBe(-125);
    });
  });

  describe('calculateSettlements', () => {
    it('should generate correct settlement transactions', () => {
      const balances = { 1: 20, 2: -20 };
      const userMap = new Map([
        [1, 'Alice'],
        [2, 'Bob'],
      ]);

      const settlements = calculateSettlements(balances, userMap);

      expect(settlements).toHaveLength(1);
      expect(settlements[0]).toEqual({
        from: 2,
        to: 1,
        amount: 20,
        names: { from: 'Bob', to: 'Alice' },
      });
    });

    it('should handle no settlements needed', () => {
      const balances = { 1: 0, 2: 0 };
      const userMap = new Map([
        [1, 'Alice'],
        [2, 'Bob'],
      ]);

      const settlements = calculateSettlements(balances, userMap);

      expect(settlements).toHaveLength(0);
    });

    it('should handle complex multi-person settlements', () => {
      const balances = { 1: 100, 2: -50, 3: -50 };
      const userMap = new Map([
        [1, 'Alice'],
        [2, 'Bob'],
        [3, 'Charlie'],
      ]);

      const settlements = calculateSettlements(balances, userMap);

      expect(settlements.length).toBeGreaterThan(0);
      expect(settlements[0].from).toBe(2);
      expect(settlements[0].to).toBe(1);
      expect(settlements[0].amount).toBe(50);
    });

    it('should match users with unknown user names', () => {
      const balances = { 1: 50, 2: -50 };
      const userMap = new Map(); // Empty map

      const settlements = calculateSettlements(balances, userMap);

      expect(settlements[0].names.from).toBe('Unknown');
      expect(settlements[0].names.to).toBe('Unknown');
    });
  });

  describe('splitExpenseEqually', () => {
    it('should split amount equally among members', () => {
      const share = splitExpenseEqually(100, 2);

      expect(share).toBe(50);
    });

    it('should round to 2 decimal places', () => {
      const share = splitExpenseEqually(100, 3);

      expect(share).toBe(33.33);
    });

    it('should handle single member', () => {
      const share = splitExpenseEqually(100, 1);

      expect(share).toBe(100);
    });

    it('should return 0 for zero members', () => {
      const share = splitExpenseEqually(100, 0);

      expect(share).toBe(0);
    });

    it('should handle decimal amounts', () => {
      const share = splitExpenseEqually(50.5, 2);

      expect(share).toBe(25.25);
    });

    it('should handle large numbers', () => {
      const share = splitExpenseEqually(9999.99, 4);

      expect(share).toBeCloseTo(2500, 0);
    });
  });

  describe('getSummaryPerPerson', () => {
    it('should calculate correct summary for each person', () => {
      const summary = getSummaryPerPerson(mockExpenses);

      expect(summary).toHaveLength(2);
      
      const user1Summary = summary.find(s => s.userId === 1);
      expect(user1Summary).toBeDefined();
      expect(user1Summary?.totalPaid).toBe(100);
      expect(user1Summary?.totalOwed).toBe(80);
      expect(user1Summary?.netBalance).toBe(20);

      const user2Summary = summary.find(s => s.userId === 2);
      expect(user2Summary).toBeDefined();
      expect(user2Summary?.totalPaid).toBe(60);
      expect(user2Summary?.totalOwed).toBe(80);
      expect(user2Summary?.netBalance).toBe(-20);
    });

    it('should return empty array for no expenses', () => {
      const summary = getSummaryPerPerson([]);

      expect(summary).toHaveLength(0);
    });

    it('should be sorted by userId', () => {
      const summary = getSummaryPerPerson(mockExpenses);

      expect(summary[0].userId).toBe(1);
      expect(summary[1].userId).toBe(2);
    });

    it('should handle person with only paid expenses', () => {
      const expenseOnly: Expense[] = [
        {
          id: 1,
          amount: 100,
          category: 'Food',
          date: '2024-01-15',
          payerId: 1,
          createdAt: '2024-01-15',
          members: [
            { id: 1, expenseId: 1, userId: 2, share: 100 },
          ],
        },
      ];

      const summary = getSummaryPerPerson(expenseOnly);

      const user1 = summary.find(s => s.userId === 1);
      expect(user1?.totalPaid).toBe(100);
      expect(user1?.totalOwed).toBe(0);
      expect(user1?.netBalance).toBe(100);
    });

    it('should calculate net balance with 2 decimal precision', () => {
      const precisionExpense: Expense[] = [
        {
          id: 1,
          amount: 33.33,
          category: 'Food',
          date: '2024-01-15',
          payerId: 1,
          createdAt: '2024-01-15',
          members: [
            { id: 1, expenseId: 1, userId: 1, share: 11.11 },
            { id: 2, expenseId: 1, userId: 2, share: 11.11 },
            { id: 3, expenseId: 1, userId: 3, share: 11.11 },
          ],
        },
      ];

      const summary = getSummaryPerPerson(precisionExpense);

      const user1 = summary.find(s => s.userId === 1);
      expect(user1?.netBalance).toBe(parseFloat((33.33 - 11.11).toFixed(2)));
    });
  });
});
