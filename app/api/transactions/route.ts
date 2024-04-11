import { getAllTransactions } from "@/lib/transactions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cashDeskId = searchParams.get("cashDeskId");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : undefined;
  const pageSize = searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize")!)
    : undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const transactions = await getAllTransactions(
    cashDeskId!,
    page,
    pageSize,
    startDate,
    endDate
  );

  return Response.json(transactions);
}
