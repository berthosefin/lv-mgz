import { getArticle } from "@/lib/articles";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const articleData = await getArticle(id);

  return Response.json(articleData);
}
