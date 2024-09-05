import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CashDeskCurrentAmountCard = ({
  currentAmount,
}: {
  currentAmount: number;
}) => {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Solde</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentAmount.toLocaleString() + " MGA"}
        </div>
        <p className="text-xs text-muted-foreground">Solde de caisse</p>
      </CardContent>
    </Card>
  );
};
