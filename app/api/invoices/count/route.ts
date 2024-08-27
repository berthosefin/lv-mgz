import { getInvoiceCount } from "@/lib/invoices";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const clientName = searchParams.get("clientName") || undefined;
  const isPaid = searchParams.get("isPaid") || undefined;

  const invoicesCount = await getInvoiceCount(storeId!, clientName, isPaid);

  return Response.json(invoicesCount);
}
