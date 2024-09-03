import { API_URL } from "@/lib/constants";
import { cookies } from "next/headers";

export const getTransactionsMonthlySummary = async (storeId: string) => {
  const accessToken = cookies().get("access_token")?.value;

  const res = await fetch(
    `${API_URL}/transactions/monthly-summary?storeId=${storeId}&year=${new Date().getFullYear()}`,
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
