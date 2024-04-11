import ArticleReplenishForm from "@/components/ArticleReplenishForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserData } from "@/lib/users";

type Props = {
  params: {
    id: string;
  };
};

export default async function ReplenishArticle({ params }: Props) {
  const userData: User = await getUserData();
  const userCashDesk: CashDesk = userData.store.cashDesk;

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Réapprovisionnement du stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ArticleReplenishForm
          userCashDesk={userCashDesk}
          articleId={params.id}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/articles" name="List des articles" />
      </CardFooter>
    </Card>
  );
}
