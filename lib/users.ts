import { validateRequest } from "./auth";

const API_URL = process.env.API_URL;

export const getUser = async (username: string) => {
  const res = await fetch(`${API_URL}/users/${username}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed to fetch user");

  return res.json();
};

export const getUserData = async () => {
  const { user } = await validateRequest();
  if (!user) throw new Error("User not authenticated");

  const userData: User = await getUser(user.username);

  return userData;
};
