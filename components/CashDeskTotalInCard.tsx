import { getCurrentYearDates } from "@/lib/get-current-year-dates";
import { getTransactionsTotalIn } from "@/lib/get-transactions-total-in";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CashDeskTotalInCard = async ({
  cashDeskId,
}: {
  cashDeskId: string;
}) => {
  const { startDate, endDate } = getCurrentYearDates();
  const totalIn = await getTransactionsTotalIn(cashDeskId, startDate, endDate);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{"Entrées"}</CardTitle>
        <span className="h-4 w-4 text-muted-foreground">
          <ArrowUpRight />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalIn.toLocaleString() + " MGA"}
        </div>
        <p className="text-xs text-muted-foreground">
          {"Total des Entrées de cette année"}
        </p>
      </CardContent>
    </Card>
  );
};
