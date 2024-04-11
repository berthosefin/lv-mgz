const API_URL = process.env.API_URL;

export const getAllTransactions = async (
  cashDeskId: string,
  page?: number,
  pageSize?: number,
  startDate?: string,
  endDate?: string
) => {
  let apiUrl = `${API_URL}/transactions`;

  const params = new URLSearchParams();

  params.append("cashDeskId", cashDeskId.toString());

  if (page && pageSize) {
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());
  }

  if (startDate && endDate) {
    params.append("startDate", startDate);
    params.append("endDate", endDate);
  }

  if (params.toString()) {
    apiUrl += `?${params.toString()}`;
  }

  const res = await fetch(apiUrl, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed to fetch all transactions");

  return res.json();
};

export const getTransactionsCount = async (
  cashDeskId: string,
  startDate?: string,
  endDate?: string
) => {
  let apiUrl = `${API_URL}/transactions/count?cashDeskId=${cashDeskId}`;

  if (startDate && endDate) {
    apiUrl += `&startDate=${startDate}&endDate=${endDate}`;
  }

  const res = await fetch(apiUrl, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed to fetch the count of transactions");

  return res.json();
};

export const getTransactionsTotalIn = async (transactions: Transaction[]) => {
  const totalIn = transactions.reduce(
    (total: number, transaction: Transaction) =>
      transaction.type === "IN" ? total + transaction.amount : total,
    0
  );

  return totalIn;
};

export const getTransactionsTotalOut = async (transactions: Transaction[]) => {
  const totalOut = transactions.reduce(
    (total: number, transaction: Transaction) =>
      transaction.type === "OUT" ? total + transaction.amount : total,
    0
  );

  return totalOut;
};
