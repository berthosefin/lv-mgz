// USER
interface User {
  id: string;
  username: string;
  store: Store;
  createdAt: string;
  updatedAt: string;
}

// USER
interface Store {
  id: string;
  name: string;
  userId: string;
  cashDesk: CashDesk;
  articles: Article[];
  createdAt: string;
  updatedAt: string;
}

// ARTICLES
interface Article {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  storeId: string;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

// TRANSACTIONS
interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  label: string;
  articles: Article[];
  cashDeskId: string;
  createdAt: string;
  updatedAt: string;
}

// CASHDESKS
interface CashDesk {
  id: string;
  currentAmount: number;
  storeId: string;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

type TransactionType = "IN" | "OUT";
