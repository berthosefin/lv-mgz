import { getArticlesCount } from "@/lib/articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  const articlesCount = await getArticlesCount(storeId!);

  return Response.json(articlesCount);
}
