import { getUser } from "@/lib/users";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;
  const userData = await getUser(username);

  return Response.json(userData);
}
