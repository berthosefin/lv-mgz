import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateInvoiceAction } from "@/lib/actions/update-invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, Edit3, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  isPaid: z.boolean(),
});

export const InvoiceUpdateForm = ({ invoice }: { invoice: Invoice }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { execute, isPending } = useServerAction(updateInvoiceAction);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (invoice) {
      form.reset(invoice);
    }
  }, [invoice, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [data, err] = await execute({
      id: invoice.id,
      updateInvoiceData: values,
    });

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
    } else if (data) {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: `Mise à jours`,
        description: `Facture mise à jour avec succès !`,
      });
      setOpen(false);
      form.reset();
    }
  }

  const isSwitchDisabled = (fieldName: keyof z.infer<typeof formSchema>) => {
    return invoice ? invoice[fieldName] : true;
  };

  const Content = (
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <fieldset className="gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Status</legend>
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
          </fieldset>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <span className="flex">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </span>
            ) : (
              <span className="flex">
                <RefreshCw className="mr-2 h-4 w-4" />
                Mettre à jour
              </span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <Edit3 className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Mise à jour</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{Content}</div>
          <DrawerFooter className="pt-4">
            <DrawerClose asChild>
              <Button variant="outline">
                <Ban className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Edit3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mise à jour</DialogTitle>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
};
