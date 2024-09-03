import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CashDeskCurrentAmountCard = ({
  currentAmount,
}: {
  currentAmount: number;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{"Solde"}</CardTitle>
        <span className="h-4 w-4 text-muted-foreground">
          <Wallet />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentAmount.toLocaleString() + " MGA"}
        </div>
        <p className="text-xs text-muted-foreground">{"Solde de caisse"}</p>
      </CardContent>
    </Card>
  );
};
