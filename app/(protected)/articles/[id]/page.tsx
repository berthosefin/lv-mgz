import ArticleReplenishForm from "@/components/ArticleReplenishForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  params: {
    id: string;
  };
};

export default async function ReplenishArticle({ params }: Props) {
  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Réapprovisionnement du stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ArticleReplenishForm articleId={params.id} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/articles" name="List des articles" />
      </CardFooter>
    </Card>
  );
}
