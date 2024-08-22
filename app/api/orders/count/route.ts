import { getOrderCount } from "@/lib/orders";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  const ordersCount = await getOrderCount(storeId!);

  return Response.json(ordersCount);
}
