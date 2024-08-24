import InvoiceHeaderForm from "@/components/InvoiceHeaderForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/users";

export default async function InvoiceHeader() {
  const userData: User = await getUser();

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Informations sur le magasin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InvoiceHeaderForm userData={userData} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/invoices" name="List des factures" />
      </CardFooter>
    </Card>
  );
}
