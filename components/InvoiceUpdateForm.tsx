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
import { fetcher } from "@/lib/fetcher";
import { updateInvoice } from "@/lib/invoices.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import MyButton from "./MyButton";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  isPaid: z.boolean(),
});

type Props = {
  invoiceId: string;
};

const InvoiceUpdateForm = ({ invoiceId }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: invoice,
    isLoading,
    error: invoiceError,
  } = useSWR(`/api/invoices/${invoiceId}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPaid: false,
    },
  });

  // Update form values when invoice data is fetched
  useEffect(() => {
    if (invoice) {
      form.reset(invoice);
    }
  }, [invoice, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    try {
      await updateInvoice(invoiceId, values);

      toast({
        title: `Mise à jour de la facture de: ${invoice.client.name}`,
        description: `La mise à jour a été effectuée avec succès !`,
      });

      form.reset();
      router.push("/invoices");
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour de la facture.");
    } finally {
      setBtnLoading(false);
    }
  }

  const isSwitchDisabled = (fieldName: keyof z.infer<typeof formSchema>) => {
    return invoice ? invoice[fieldName] : true;
  };

  if (invoiceError) {
    return (
      <div className="mt-4">
        <ErrorMessage errorMessage="Erreur lors du chargement des informations sur le commande" />
      </div>
    );
  }

  if (isLoading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <>
      <ScrollArea className="h-48 w-full rounded-md binvoice mb-4">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">
            Articles dans la commande de{" "}
            <span className="text-primary font-bold">
              {invoice.client.name}
            </span>
          </h4>
          {invoice.invoiceItems.map((item: any) => (
            <div key={item.id} className="text-sm">
              <div className="flex justify-between">
                <div>{item.article.name}</div>
                <div>{item.quantity}</div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mx-auto max-w-md"
        >
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg binvoice p-4">
                <div className="space-y-0.5">
                  <FormLabel>
                    MONTANT: {invoice.amount.toLocaleString()} MGA
                  </FormLabel>
                </div>
                <FormLabel>Payé</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSwitchDisabled("isPaid")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MyButton
            label="Valider"
            loading={btnLoading}
            errorMessage={errorMessage}
          />
        </form>
      </Form>
    </>
  );
};

export default InvoiceUpdateForm;
