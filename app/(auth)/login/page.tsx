import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import Link from "next/link";

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
        <Button variant={"link"} asChild>
          <Link href={"/signup"} className="flex">
            <UserPlus size={10} className="mr-2" />
            Créer un compte
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
