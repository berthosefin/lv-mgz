import { cookies } from "next/headers";
import { API_URL } from "./constants";

export const getTransactionsTotalOut = async (
  cashDeskId: string,
  startDate: Date,
  endDate: Date
) => {
  const accessToken = cookies().get("access_token")?.value;

  const res = await fetch(
    `${API_URL}/transactions/totalOut?cashDeskId=${cashDeskId}&startDate=${startDate}&endDate=${endDate}`,
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
