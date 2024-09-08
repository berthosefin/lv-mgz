import OrderNewForm from "@/components/OrderNewForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserData } from "@/lib/get-user-data";
import { MoveDownLeft } from "lucide-react";
import Link from "next/link";

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
        <Button variant={"link"} asChild>
          <Link href={"/orders"} className="flex">
            <MoveDownLeft size={10} className="mr-2" />
            List des commandes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
