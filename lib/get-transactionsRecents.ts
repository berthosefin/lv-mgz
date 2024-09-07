import { cookies } from "next/headers";
import { API_URL } from "./constants";

export const getTransactionsRecents = async (
  cashDeskId: string,
  page?: number,
  pageSize?: number
) => {
  const accessToken = cookies().get("access_token")?.value;

  let url = `${API_URL}/transactions/?cashDeskId=${cashDeskId}`;

  if (page && pageSize) {
    url += `&page=${page}&pageSize=${pageSize}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return await res.json();
};
