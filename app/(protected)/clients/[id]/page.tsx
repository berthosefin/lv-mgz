import ClientEditForm from "@/components/ClientEditForm";
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

export default async function EditClient({ params }: Props) {
  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Informations sur le client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ClientEditForm clientId={params.id} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/clients" name="List des clients" />
      </CardFooter>
    </Card>
  );
}
