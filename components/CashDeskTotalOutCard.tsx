import { getCurrentYearDates } from "@/lib/get-current-year-dates";
import { getTransactionsTotalOut } from "@/lib/get-transactions-total-out";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CashDeskTotalOutCard = async ({
  cashDeskId,
}: {
  cashDeskId: string;
}) => {
  const { startDate, endDate } = getCurrentYearDates();
  const totalOut = await getTransactionsTotalOut(
    cashDeskId,
    startDate,
    endDate
  );
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{"Sorties"}</CardTitle>
        <span className="h-4 w-4 text-muted-foreground">
          <ArrowUpRight />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalOut.toLocaleString() + " MGA"}
        </div>
        <p className="text-xs text-muted-foreground">
          {"Total des Sorties de cette année"}
        </p>
      </CardContent>
    </Card>
  );
};
