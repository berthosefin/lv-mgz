import { getOrder } from "@/lib/orders";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const orderData = await getOrder(id);

  return Response.json(orderData);
}
