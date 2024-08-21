import { getClientCount } from "@/lib/clients";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  const articlesCount = await getClientCount(storeId!);

  return Response.json(articlesCount);
}
