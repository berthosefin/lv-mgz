import { getAllInvoices } from "@/lib/invoices";

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
  const isPaid = searchParams.get("isPaid") || undefined;

  const invoices = await getAllInvoices(
    storeId!,
    page,
    pageSize,
    clientName,
    isPaid
  );

  return Response.json(invoices);
}
