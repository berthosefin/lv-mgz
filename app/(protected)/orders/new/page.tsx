import ArticleSellForm from "@/components/ArticleSellForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/users";

export default async function SellArticle() {
  const userData: User = await getUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle commande</CardTitle>
      </CardHeader>
      <CardContent>
        <ArticleSellForm userData={userData} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/orders" name="List des commandes" />
      </CardFooter>
    </Card>
  );
}
