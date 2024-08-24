// USER
interface User {
  id: string;
  username: string;
  hashedPassword: string;
  store: Store;
  createdAt: string;
  updatedAt: string;
}

// STORE
interface Store {
  id: string;
  name: string;
  description?: string;
  status?: string;
  nif?: string;
  stat?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  userId: string;
  user: User; // Un magasin doit avoir un utilisateur associé
  cashDesk: CashDesk;
  articles: Article[];
  clients: Client[];
  orders: Order[];
  invoices: Invoice[];
  createdAt: string;
  updatedAt: string;
}

// ARTICLE
interface Article {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  storeId: string;
  store: Store; // Un article doit appartenir à un magasin
  transactions: Transaction[];
  orderItems: OrderItem[];
  invoiceItems: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

// TRANSACTION
interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  label: string;
  articles: Article[]; // Transactions peuvent être associées à plusieurs articles
  cashDeskId: string;
  cashDesk: CashDesk; // Une transaction est associée à un tiroir-caisse
  createdAt: string;
  updatedAt: string;
}

// CASHDESK
interface CashDesk {
  id: string;
  currentAmount: number;
  storeId: string;
  store: Store; // Un tiroir-caisse appartient à un magasin
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

// CLIENT
interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  storeId: string;
  store: Store; // Un client est associé à un magasin
  orders: Order[];
  invoices: Invoice[];
  createdAt: string;
  updatedAt: string;
}

// ORDER
interface Order {
  id: string;
  clientId: string;
  client: Client; // Une commande est associée à un client
  isPaid: boolean;
  isDelivered: boolean;
  invoice?: Invoice;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ORDERITEM
interface OrderItem {
  id: string;
  orderId: string;
  order: Order; // Un article de commande appartient à une commande
  articleId: string;
  article: Article; // Un article de commande est associé à un article
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// INVOICE
interface Invoice {
  id: string;
  storeId: string;
  store: Store; // Une facture est associée à une commande
  orderId: string;
  order: Order; // Une facture est associée à une commande
  clientId: string;
  client: Client; // Une facture est associée à un client
  amount: number;
  isPaid: boolean;
  invoiceItems: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

// INVOICEITEM
interface InvoiceItem {
  id: string;
  invoiceId: string;
  invoice: Invoice; // Un article de facture appartient à une facture
  articleId: string;
  article: Article; // Un article de facture est associé à un article
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// TRANSACTIONTYPE
type TransactionType = "IN" | "OUT";

// ORDERSTATUS
type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED";

// INVOICESTATUS
type InvoiceStatus = "UNPAID" | "PAID";
