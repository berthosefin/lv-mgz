import { getInvoiceCount } from "@/lib/invoices";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  const invoicesCount = await getInvoiceCount(storeId!);

  return Response.json(invoicesCount);
}
