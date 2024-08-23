import { getInvoice } from "@/lib/invoices";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const invoiceData = await getInvoice(id);

  return Response.json(invoiceData);
}
