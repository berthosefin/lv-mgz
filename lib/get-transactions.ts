import Cookies from "js-cookie";
import { API_URL } from "./constants";

export const getTransactions = async (
  cashDeskId: string,
  pageIndex: number,
  pageSize: number,
  startDate: string,
  endDate: string
) => {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(
    `${API_URL}/transactions?cashDeskId=${cashDeskId}&page=${pageIndex}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`,
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
