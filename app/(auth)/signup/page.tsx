import SignupForm from "@/components/SignupForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Page() {
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
        <Button variant={"link"} asChild>
          <Link href={"/login"} className="flex">
            <LogIn size={10} className="mr-2" />
            Se connecter
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
