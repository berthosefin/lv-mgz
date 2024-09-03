import { cookies } from "next/headers";
import { API_URL } from "./constants";

export const getArtcilesCount = async (storeId: string) => {
  const accessToken = cookies().get("access_token")?.value;

  const res = await fetch(`${API_URL}/articles/count?storeId=${storeId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return await res.json();
};
