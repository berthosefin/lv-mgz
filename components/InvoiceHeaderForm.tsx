"use client";

import { Loader } from "@/components/Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetcher } from "@/lib/fetcher";
import { editStore } from "@/lib/store.actions";
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
  description: z.string().optional(),
  status: z.string().optional(),
  nif: z.string().optional(),
  stat: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

type Props = {
  userData: User;
};

const InvoiceHeaderForm = ({ userData }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: invoice,
    isLoading,
    error: invoiceError,
  } = useSWR(`${API_URL}/store/${userData.store.id}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Update form values when invoice data is fetched
  useEffect(() => {
    if (invoice) {
      form.reset(invoice); // Reset form with fetched invoice data
    }
  }, [invoice, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    await editStore(userData.store.id, values);

    toast({
      title: `Magasin: ${values.name}`,
      description: `La mise à jour des informations a été effectuée avec succès !`,
    });

    form.reset();
    setBtnLoading(false);
    router.push("/invoices");
  }

  if (invoiceError) {
    return (
      <div className="mt-4">
        <ErrorMessage errorMessage="Erreur lors du chargement des informations sur le invoice" />
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
        className="space-y-8 mx-auto max-w-lg"
      >
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        {/* Section: Informations de base */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informations de base</h3>
          <FormField
            control={form.control}
            name="name"
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

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input placeholder="Status" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section: Informations fiscales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informations fiscales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF</FormLabel>
                  <FormControl>
                    <Input placeholder="NIF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>STAT</FormLabel>
                  <FormControl>
                    <Input placeholder="STAT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section: Détails de contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Détails de contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default InvoiceHeaderForm;
