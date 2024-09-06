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
import { signupAction } from "@/lib/actions/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

export const formSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(31)
      .regex(/^[a-z0-9_-]+$/, {
        message:
          "Le nom d'utilisateur doit contenir uniquement des lettres minuscules, des chiffres, des tirets bas et des tirets.",
      }),
    password: z.string().min(6).max(255),
    confirmPassword: z.string(),
    storeName: z.string().min(3).max(31),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const SignupForm = () => {
  const { isPending, execute } = useServerAction(signupAction);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [data, err] = await execute({
      username: values.username,
      password: values.password,
      storeName: values.storeName,
    });

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
    }

    if (data) {
      router.push("/login");
      toast({
        title: `Création de compte`,
        description: `Compte utilisateur crée avec succès !`,
      });
      form.reset();
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">S&apos;inscrire</CardTitle>
        <CardDescription>
          Entrez vos informations pour créer un compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du magasin</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du magasin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
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
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? `Chargement...` : `Créer un compte`}
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Inscrivez-vous avec Google
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
