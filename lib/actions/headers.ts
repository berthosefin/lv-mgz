import { cookies } from "next/headers";

export const getHeaders = () => {
  const accessToken = cookies().get("access_token")?.value;

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};
