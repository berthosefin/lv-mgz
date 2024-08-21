import CashDeskOperationForm from "@/components/CashDeskOperationForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/users";

export default async function CashDeskOperation() {
  const userData: User = await getUser();
  const userCashDesk: CashDesk = userData.store.cashDesk;

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Opération dans la caisse</CardTitle>
      </CardHeader>
      <CardContent>
        <CashDeskOperationForm userCashDesk={userCashDesk} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/cashdesks" name="Page de caisse" />
      </CardFooter>
    </Card>
  );
}
