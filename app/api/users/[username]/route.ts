import { getUser } from "@/lib/users";

export async function GET() {
  const userData = await getUser();

  return Response.json(userData);
}
