import InvoiceUpdateForm from "@/components/InvoiceUpdateForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserData } from "@/lib/get-user-data";

type Props = {
  params: {
    id: string;
  };
};

export default async function UpdateInvoice({ params }: Props) {
  const userData: User = await getUserData();

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Mise à jour d&apos;une facture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InvoiceUpdateForm invoiceId={params.id} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/invoices" name="List des factures" />
      </CardFooter>
    </Card>
  );
}
