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
import { loginAction } from "@/lib/actions/auth";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const LoginForm = () => {
  const { isPending, execute } = useServerAction(loginAction);
  const router = useRouter();
  const { setUser } = useUserStore.getState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [data, err] = await execute({
      email: values.email,
      password: values.password,
    });

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
      return;
    }

    if (data) {
      toast({
        title: `Connexion`,
        description: `Utilisateur connectée avec succès !`,
      });

      setUser(
        data.id,
        data.username,
        data.storeId,
        data.cashDeskId,
        data.currency
      );
      form.reset();
      router.push("/");
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
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
                  className="ml-auto inline-block text-sm underline text-muted-foreground"
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
