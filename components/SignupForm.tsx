"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signup } from "@/lib/auth.actions";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import MyButton from "./MyButton";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const formSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(31)
      .regex(/^[a-z0-9_-]+$/),
    password: z.string().min(6).max(255),
    confirmPassword: z.string(),
    storeName: z.string().min(3).max(31),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      storeName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    const { username, confirmPassword, storeName } = values;

    const res = await signup({
      username,
      password: confirmPassword,
      storeName,
    });
    if (res && res.error) {
      setErrorMessage(res.error);
    } else if (res.user) {
      setErrorMessage("");
      setUser(res.user.id, res.user.username);
      toast({
        description: `Compte utilisateur "${res.user.username}" crée avec succès !`,
      });
      form.reset();
      router.push("/");
    }

    setBtnLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mx-auto max-w-md"
      >
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        <div className="flex space-x-4">
          <div className="w-full">
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
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du magasin</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom du magasin"
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
          </div>
        </div>

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
          label="Créer"
          loading={btnLoading}
          errorMessage={errorMessage}
          icon={<UserPlus size={16} className="mr-2 h-4 w-4" />}
        />
      </form>
    </Form>
  );
};

export default SignupForm;
