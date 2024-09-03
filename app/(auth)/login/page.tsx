import LoginForm from "@/components/LoginForm";
import MyButtonBack from "@/components/MyButtonBack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default async function Page() {
  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Se connecter</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack
          path="/signup"
          name="Créer un compte"
          icon={<UserPlus size={10} className="mr-2" />}
        />
      </CardFooter>
    </Card>
  );
}
