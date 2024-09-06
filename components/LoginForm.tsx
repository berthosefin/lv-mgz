"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/login";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginForm = () => {
  const { isPending, execute } = useServerAction(loginAction);
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUserStore.getState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [data, err] = await execute({
      username: values.username,
      password: values.password,
    });

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
    }

    if (data) {
      router.push("/");
      toast({
        title: `Connexion`,
        description: `Utilisateur connectée avec succès !`,
      });

      setUser(
        data.sub as string,
        data.username as string,
        data.storeId as string,
        data.cashDeskId as string
      );
      form.reset();
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Se connecter</CardTitle>
        <CardDescription>
          Entrez votre nom d&apos;utilisateur ci-dessous pour vous connecter à
          votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d&apos;utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom d'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <FormLabel>Mot de passe</FormLabel>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? `Chargement...` : `Se connecter`}
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Se connecter avec Google
            </Button>
            <div className="grid gap-2"></div>
          </form>
          <div className="mt-4 text-center text-sm">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/signup" className="underline">
              S&apos;inscrire
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
