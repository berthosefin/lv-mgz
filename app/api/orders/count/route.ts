import { getOrderCount } from "@/lib/orders";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const clientName = searchParams.get("clientName") || undefined;
  const status = searchParams.get("status") || undefined;

  const ordersCount = await getOrderCount(storeId!, clientName, status);

  return Response.json(ordersCount);
}
