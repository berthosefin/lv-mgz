import { getAllArticles } from "@/lib/articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : undefined;
  const pageSize = searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize")!)
    : undefined;
  const search = searchParams.get("search") || "";

  const articles = await getAllArticles(storeId!, page, pageSize, search);

  return Response.json(articles);
}
