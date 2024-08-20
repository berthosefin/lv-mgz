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
        <CardTitle>Vente d&apos;articles</CardTitle>
      </CardHeader>
      <CardContent>
        <ArticleSellForm userData={userData} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/articles" name="List des articles" />
      </CardFooter>
    </Card>
  );
}
