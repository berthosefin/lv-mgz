import MyButtonBack from "@/components/MyButtonBack";
import OrderNewForm from "@/components/OrderNewForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserData } from "@/lib/get-user-data";

export default async function SellArticle() {
  const userData: User = await getUserData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle commande</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderNewForm userData={userData} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/orders" name="List des commandes" />
      </CardFooter>
    </Card>
  );
}
