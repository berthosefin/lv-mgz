"use server";

const API_URL = process.env.API_URL;

export const createUser = async (data: {
  id: string;
  username: string;
  password: string;
  storeName: string;
}) => {
  const { id, username, password, storeName } = data;
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, username, password, storeName }),
  });

  if (!res.ok) throw new Error("failed to create user");

  return res.json();
};
