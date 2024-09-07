import Cookies from "js-cookie";
import { API_URL } from "./constants";

export const getArtciles = async (
  storeId: string,
  pageIndex: number,
  pageSize: number,
  search: string
) => {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(
    `${API_URL}/articles?storeId=${storeId}&page=${pageIndex}&pageSize=${pageSize}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return await res.json();
};
