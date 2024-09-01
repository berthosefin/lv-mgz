"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signup = async (data: {
  username: string;
  password: string;
  storeName: string;
}) => {
  const { username, password, storeName } = data;

  try {
    // Appel à l'API NestJS pour créer un nouvel utilisateur
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, storeName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error:
          errorData.message ||
          "Une erreur inattendue s'est produite lors de l'inscription.",
      };
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return {
      error: "Une erreur inattendue s'est produite lors de l'inscription.",
    };
  }
};

export const login = async (data: { username: string; password: string }) => {
  const { username, password } = data;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Incorrect username or password" };
    }

    const { access_token, refresh_token } = await response.json();
    cookies().set("access_token", access_token, { path: "/" });
    cookies().set("refresh_token", refresh_token, { path: "/" });
    const decodedToken: any = jwtDecode(access_token);
    const userId = decodedToken.sub;

    // Retourner les détails de l'utilisateur
    const user = { id: userId, username };
    return { user };
  } catch (error) {
    return { error: "An unexpected error occurred during login." };
  }
};

export const logout = async () => {
  const access_token = cookies().get("access_token");

  try {
    if (access_token?.value) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token.value}`,
        },
      });

      const cookieOptions = {
        path: "/",
        expires: new Date(0),
      };
      cookies().set("access_token", "", cookieOptions);
      cookies().set("refresh_token", "", cookieOptions);
    }

    return { success: true };
  } catch (error) {
    return { error: "An error occurred while logging out." };
  }
};
