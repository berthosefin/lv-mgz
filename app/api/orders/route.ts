import { getAllOrders } from "@/lib/orders";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : undefined;
  const pageSize = searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize")!)
    : undefined;
  const clientName = searchParams.get("clientName") || undefined;
  const status = searchParams.get("status") || undefined;

  const orders = await getAllOrders(
    storeId!,
    page,
    pageSize,
    clientName,
    status
  );

  return Response.json(orders);
}
