"use client";

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
import { Loader2, LogInIcon } from "lucide-react";
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

const LoginForm = () => {
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
        title: `Bienvenue !`,
        description: `${data.username}`,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mx-auto max-w-md"
      >
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mot de passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full mt-4">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement
            </>
          ) : (
            <>
              <LogInIcon size={16} className="mr-2 h-4 w-4" />
              Se connecter
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
