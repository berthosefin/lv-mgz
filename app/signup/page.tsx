import MyButtonBack from "@/components/MyButtonBack";
import SignupForm from "@/components/SignupForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validateRequest } from "@/lib/auth";
import { LogIn } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Crée un nouvel utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <MyButtonBack
          path="/login"
          name="Se connecter"
          icon={<LogIn size={10} className="mr-2" />}
        />
      </CardFooter>
    </Card>
  );
}
