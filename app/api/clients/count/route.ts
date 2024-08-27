import { getClientCount } from "@/lib/clients";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const search = searchParams.get("search") || "";

  const clientCount = await getClientCount(storeId!, search);

  return Response.json(clientCount);
}
