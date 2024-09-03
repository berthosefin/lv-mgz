import ClientAddForm from "@/components/ClientAddForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserData } from "@/lib/get-user-data";

export default async function AddClient() {
  const userData: User = await getUserData();

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Ajout d&apos;un nouvel client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ClientAddForm userData={userData} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack path="/clients" name="List des clients" />
      </CardFooter>
    </Card>
  );
}
