import { getTransactionsCount } from "@/lib/transactions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cashDeskId = searchParams.get("cashDeskId");
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const transactionsCount = await getTransactionsCount(
    cashDeskId!,
    startDate,
    endDate
  );

  return Response.json(transactionsCount);
}
