import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions extends Omit<RequestInit, "method" | "body"> {
  method: HttpMethod;
  body?: Record<string, any>;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAccessToken(): Promise<string | undefined> {
  if (typeof window !== "undefined") {
    // Client-side
    return Cookies.get("access_token");
  } else {
    // Server-side
    const { cookies } = await import("next/headers");
    return cookies().get("access_token")?.value;
  }
}

export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: FetchOptions = { method: "GET" }
): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "Une erreur est survenue"
    );
  }

  return response.json();
}

export async function fetchWithoutAuth<T = any>(
  endpoint: string,
  options: FetchOptions = { method: "GET" }
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Une erreur est survenue");
  }

  return response.json();
}
