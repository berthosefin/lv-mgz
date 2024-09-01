import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUser = async () => {
  const access_token = cookies().get("access_token");

  if (!access_token) {
    redirect("/login");
  }

  const decodedToken: any = jwtDecode(access_token.value);

  const res = await fetch(`${API_URL}/users/${decodedToken.username}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token.value}`,
    },
  });

  if (!res.ok) redirect("/login");

  return res.json();
};
