import { fetchWithAuth } from "@/lib/api-utils";
import { getCurrentYearDates } from "@/lib/get-current-year-dates";
import { getSession } from "@/lib/get-session";
import { ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CashDeskTotalOutCard = async () => {
  const { cashDeskId, currency } = await getSession();
  const { startDate, endDate } = getCurrentYearDates();
  const totalOut = await fetchWithAuth(
    `/transactions/totalOut?cashDeskId=${cashDeskId}&startDate=${startDate}&endDate=${endDate}`
  );

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sorties</CardTitle>
        <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalOut.toLocaleString() + " " + currency}
        </div>
        <p className="text-xs text-muted-foreground">
          Total des Sorties de cette année
        </p>
      </CardContent>
    </Card>
  );
};
