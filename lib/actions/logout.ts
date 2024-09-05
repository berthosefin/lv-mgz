"use server";

import { cookies } from "next/headers";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

export const logoutAction = createServerAction().handler(async () => {
  try {
    const accessToken = cookies().get("access_token")?.value;
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw message;
    }

    const cookieOptions = {
      path: "/",
      expires: new Date(0),
    };
    cookies().set("access_token", "", cookieOptions);
    cookies().set("refresh_token", "", cookieOptions);

    return await res.json();
  } catch (error: any) {
    throw new Error(error);
  }
});
