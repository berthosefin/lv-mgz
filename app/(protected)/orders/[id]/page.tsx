import MyButtonBack from "@/components/MyButtonBack";
import OrderUpdateForm from "@/components/OrderUpdateForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/users";

type Props = {
  params: {
    id: string;
  };
};

export default async function UpdateOrder({ params }: Props) {
  const userData: User = await getUser();

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Mise à jour d&apos;une commande
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrderUpdateForm orderId={params.id} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/articles" name="List des articles" />
      </CardFooter>
    </Card>
  );
}
