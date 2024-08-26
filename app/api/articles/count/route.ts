import { getArticlesCount } from "@/lib/articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const search = searchParams.get("search") || "";

  const articlesCount = await getArticlesCount(storeId!, search);

  return Response.json(articlesCount);
}
