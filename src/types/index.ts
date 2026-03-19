export interface User {
  id: number;
  name: string;
  email: string;
  color: string;
}

export interface ExpenseMember {
  id: number;
  expenseId: number;
  userId: number;
  share: number;
}

export interface Expense {
  id: number;
  amount: number;
  category: string;
  date: Date | string;
  payerId: number;
  members: ExpenseMember[];
  createdAt: Date | string;
}

export interface BalanceData {
  [userId: number]: number;
}

export interface Settlement {
  from: number;
  to: number;
  amount: number;
  names: {
    from: string;
    to: string;
  };
}
