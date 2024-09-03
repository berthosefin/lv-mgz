import { cookies } from "next/headers";
import { API_URL } from "./constants";

export const getTransactions = async (
  cashDeskId: string,
  page: number,
  pageSize: number
) => {
  const accessToken = cookies().get("access_token")?.value;

  const res = await fetch(
    `${API_URL}/transactions/?CashDeskId=${cashDeskId}&page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  return await res.json();
};
