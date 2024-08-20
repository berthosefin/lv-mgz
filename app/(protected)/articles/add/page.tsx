import ArticleAddForm from "@/components/ArticleAddForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/users";

export default async function AddArticle() {
  const userData: User = await getUser();

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Ajout d&apos;un nouvel article
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ArticleAddForm userData={userData} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/articles" name="List des articles" />
      </CardFooter>
    </Card>
  );
}
