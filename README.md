# 💑 Couples Expense Splitter

A modern, full-stack web application for managing and splitting expenses between couples. Built with cutting-edge technologies, this app provides an intuitive interface for tracking shared expenses, calculating balances, and suggesting fair settlements.

## ✨ Features

- **💰 Expense Tracking** - Create and manage shared expenses with detailed categorization
- **👥 Multi-user Support** - Add multiple people and track who paid for what
- **🧮 Smart Settlement Calculation** - Automatically calculates who owes whom and suggests optimal settlement transactions
- **📊 Real-time Balance Display** - Visual balance cards showing net positions for each person
- **🎨 Beautiful UI** - Responsive, modern interface with color-coded balance indicators
- **⚡ Real-time Updates** - Instantly see changes without page refresh
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **✅ Comprehensive Testing** - Full test coverage for calculation logic

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Modern React with hooks and concurrent features
- **Next.js 16.2** - React framework with App Router and Turbopack
- **TypeScript 5** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS processing pipeline

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6.19** - Type-safe ORM
- **SQLite** - Lightweight file-based database

### Development & Testing
- **Jest** - JavaScript testing framework
- **ts-jest** - TypeScript support for Jest
- **ESLint** - Code quality and consistency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sonakshi03-06panda/couples-splitter.git
   cd couples-splitter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📖 Usage Guide

### Adding Users
1. Click the form section at the top
2. Fill in the user's name, email, and select a color
3. Click "Add User" to create

### Creating Expenses
1. Select the person who paid for the expense
2. Enter the amount
3. Choose a category
4. Pick a date
5. Select the people who benefited from this expense
6. Click "Add Expense"

### Viewing Balances
- **Green cards**: Person is owed money (positive balance)
- **Red cards**: Person owes money (negative balance)
- The amount shown is the net balance owed/owing

### Settlement Suggestions
- View suggested transactions to settle all debts fairly
- "Everyone is settled!" appears when all balances are zero

## 🏗️ Project Structure

```
couples-splitter/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── users/          # User management endpoints
│   │   │   ├── expenses/        # Expense CRUD endpoints
│   │   │   └── balances/        # Balance calculation endpoint
│   │   ├── page.tsx            # Main application page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ExpenseForm.tsx     # Expense creation form
│   │   ├── BalanceDisplay.tsx  # Balance cards display
│   │   ├── SettlementSuggestions.tsx  # Settlement recommendations
│   │   └── ExpenseList.tsx     # Expense table
│   ├── lib/
│   │   ├── db.ts              # Database functions
│   │   ├── expenses.ts        # Calculation utilities
│   │   └── prisma.ts          # Prisma client singleton
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database
├── __tests__/
│   └── calculations.test.ts   # Jest test suite
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🔌 API Endpoints

### Users
- **GET** `/api/users` - Retrieve all users
- **POST** `/api/users` - Create a new user
  - Body: `{ name: string, email: string, color: string }`

### Expenses
- **GET** `/api/expenses` - Retrieve all expenses
- **POST** `/api/expenses` - Create a new expense
  - Body: `{ amount: number, category: string, date: string, payerId: number, members: [{userId, share}] }`
- **DELETE** `/api/expenses/[id]` - Delete an expense by ID

### Balances
- **GET** `/api/balances` - Calculate current balances and settlement suggestions
  - Response: `{ balances: {[userId]: number}, settlements: Settlement[] }`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage
- **Calculation Logic**: 19 comprehensive tests
  - Balance calculations
  - Settlement algorithm
  - Expense splitting
  - Summary generation

## 🗄️ Database Schema

### User Model
- `id` (PK) - Unique identifier
- `name` - User's display name
- `email` - Unique email address
- `color` - HEX color code for UI representation
- Relations: One-to-many with Expenses, One-to-many with ExpenseMembers

### Expense Model
- `id` (PK) - Unique identifier
- `amount` - Total expense amount
- `category` - Expense category
- `date` - Expense date
- `payerId` (FK) - Who paid for it
- `createdAt` - Creation timestamp
- Relations: Many-to-one with User (payer), One-to-many with ExpenseMembers (cascade delete)

### ExpenseMember Model
- `id` (PK) - Unique identifier
- `expenseId` (FK) - Associated expense
- `userId` (FK) - User who benefited
- `share` - Amount this user owes for this expense

## 📊 Algorithm Details

### Balance Calculation
Calculates net balance for each user:
- **Positive balance**: Money owed to user
- **Negative balance**: Money user owes

Formula: `balance = totalPaid - totalOwed`

### Settlement Matching
Uses a greedy algorithm to minimize the number of transactions needed to settle all debts:
1. Identify creditors (users owed money)
2. Identify debtors (users who owe money)
3. Match creditors with debtors, starting with largest amounts
4. Generate settlement transactions

## 🔐 Security

- Input validation on all API endpoints
- Email uniqueness constraints
- Type-safe database queries with Prisma
- Environment variable protection

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm test            # Run test suite once
npm run test:watch  # Run tests in watch mode
npm run lint        # Run ESLint
npx prisma studio  # Open Prisma Studio (database GUI)
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable: `DATABASE_URL=file:./prisma/dev.db`
4. Deploy!

### Deploy to Other Platforms
Ensure your platform supports Node.js 18+ and has persistent storage for SQLite database.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for managing shared expenses**
