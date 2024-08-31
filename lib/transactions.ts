import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllTransactions = async (
  cashDeskId: string,
  page?: number,
  pageSize?: number,
  startDate?: string,
  endDate?: string
) => {
  const access_token = cookies().get("access_token");

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
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch all transactions");

  return res.json();
};

export const getTransactionsMonthlySummary = async (
  storeId: string,
  year: number
) => {
  const access_token = cookies().get("access_token");

  let apiUrl = `${API_URL}/transactions/monthly-summary?storeId=${storeId}&year=${year}`;

  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok)
    throw new Error("failed to fetch the monthly summary of transactions");

  return res.json();
};

export const getTransactionsTotalIn = async (
  cashDeskId: string,
  startDate: Date,
  endDate: Date
) => {
  const access_token = cookies().get("access_token");
  let apiUrl = `${API_URL}/transactions/totalIn?cashDeskId=${cashDeskId}&startDate=${startDate}&endDate=${endDate}`;

  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch total in");

  return res.json();
};

export const getTransactionsTotalOut = async (
  cashDeskId: string,
  startDate: Date,
  endDate: Date
) => {
  const access_token = cookies().get("access_token");
  let apiUrl = `${API_URL}/transactions/totalOut?cashDeskId=${cashDeskId}&startDate=${startDate}&endDate=${endDate}`;

  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch total out");

  return res.json();
};
