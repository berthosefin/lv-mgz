"use server";

import { lucia, validateRequest } from "@/lib/auth";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { createUser } from "./users.actions";
import { getUser } from "./users";

export const signup = async (data: {
  username: string;
  password: string;
  storeName: string;
}) => {
  const { username, password, storeName } = data;

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    await createUser({
      id: userId,
      username,
      password: hashedPassword,
      storeName,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    if (error.message === "failed to create user") {
      return {
        error:
          "Ce mom d'utilisateur ou nom de magasin est déjà utilisé. Veuillez en choisir un autre.",
      };
    }
    return {
      error: "Une erreur inattendue s'est produite lors de l'inscription.",
    };
  }

  return { user: { id: userId, username } };
};

export const login = async (data: { username: string; password: string }) => {
  const { username, password } = data;

  const existingUser = await getUser(username);
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password,
    password
  );
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return { user: { id: existingUser.id, username: existingUser.username } };
};

export const logout = async () => {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
};
