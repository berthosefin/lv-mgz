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
import { login } from "@/lib/auth.actions";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import MyButton from "./MyButton";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-z0-9_-]+$/),
  password: z.string(),
});

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    try {
      const res = await login(values);

      if (res.user) {
        router.push("/");
        toast({
          description: `Bienvenue ${res.user.username} !`,
        });
        setUser(
          res.user.id,
          res.user.username,
          res.user.storeId,
          res.user.cashDEskId
        );
        form.reset();
      } else {
        setErrorMessage(res.error);
      }
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mx-auto max-w-md"
      >
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d&apos;utilisateur</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nom d'utilisateur"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setErrorMessage("");
                    field.onChange(e);
                  }}
                />
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
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setErrorMessage("");
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <MyButton
          label="Connexion"
          loading={btnLoading}
          errorMessage={errorMessage}
          icon={<LogInIcon size={16} className="mr-2 h-4 w-4" />}
        />
      </form>
    </Form>
  );
};

export default LoginForm;
