import { getStore } from "@/lib/store.service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const storeData = await getStore(id);

  return Response.json(storeData);
}
