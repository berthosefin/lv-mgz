import { fetchWithAuth } from "@/lib/api-utils";
import { getCurrentYearDates } from "@/lib/get-current-year-dates";
import { getSession } from "@/lib/get-session";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CashDeskTotalInCard = async () => {
  const { cashDeskId } = await getSession();
  const { startDate, endDate } = getCurrentYearDates();
  const totalIn = await fetchWithAuth(
    `/transactions/totalIn?cashDeskId=${cashDeskId}&startDate=${startDate}&endDate=${endDate}`
  );

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Entrées</CardTitle>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalIn.toLocaleString() + " MGA"}
        </div>
        <p className="text-xs text-muted-foreground">
          Total des Entrées de cette année
        </p>
      </CardContent>
    </Card>
  );
};
