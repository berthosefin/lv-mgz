"use client";

import Loader from "@/components/MyLoader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { editClient } from "@/lib/clients.actions";
import { fetcher } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import MyButton from "./MyButton";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type Props = {
  clientId: string;
};

const ClientEditForm = ({ clientId }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: client,
    isLoading,
    error: clientError,
  } = useSWR(`${API_URL}/clients/${clientId}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Update form values when client data is fetched
  useEffect(() => {
    if (client) {
      form.reset(client); // Reset form with fetched client data
    }
  }, [client, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    await editClient(clientId, values);

    toast({
      title: `Client: ${values.name}`,
      description: `La mise à jour des informations a été effectuée avec succès !`,
    });

    form.reset();
    setBtnLoading(false);
    router.push("/clients");
  }

  if (clientError) {
    return (
      <div className="mt-4">
        <ErrorMessage errorMessage="Erreur lors du chargement des informations sur le client" />
      </div>
    );
  }

  if (isLoading) {
    return <Loader />; // Show loader while data is being fetched
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du client</FormLabel>
              <FormControl>
                <Input placeholder="Nom du client" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="Téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <div className="w-full">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Ville" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <MyButton
          icon={<Edit3 size={16} className="mr-2 h-4 w-4" />}
          label="Modifier"
          loading={btnLoading}
          errorMessage={errorMessage}
        />
      </form>
    </Form>
  );
};

export default ClientEditForm;
