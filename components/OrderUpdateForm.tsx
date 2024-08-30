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
import { updateOrder } from "@/lib/orders.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import MyButton from "./MyButton";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  isPaid: z.boolean(),
  isDelivered: z.boolean(),
});

type Props = {
  orderId: string;
};

const OrderUpdateForm = ({ orderId }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: order,
    isLoading,
    error: orderError,
  } = useSWR(`/api/orders/${orderId}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPaid: false,
      isDelivered: false,
    },
  });

  // Update form values when order data is fetched
  useEffect(() => {
    if (order) {
      form.reset(order); // Reset form with fetched order data
    }
  }, [order, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    try {
      await updateOrder(orderId, values);

      toast({
        title: `Mise à jour du commande de: ${order.client.name}`,
        description: `La mise à jour a été effectuée avec succès !`,
      });

      form.reset();
      router.push("/orders");
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour de la commande.");
    } finally {
      setBtnLoading(false);
    }
  }

  const isSwitchDisabled = (fieldName: keyof z.infer<typeof formSchema>) => {
    return order ? order[fieldName] : true;
  };

  const calculateTotalAmount = () => {
    if (order && order.orderItems) {
      const total = order.orderItems.reduce(
        (total: number, item: OrderItem) => {
          return total + item.article.sellingPrice * item.quantity;
        },
        0
      );

      return total.toLocaleString();
    }
    return "0";
  };

  if (orderError) {
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
      <ScrollArea className="h-48 w-full rounded-md border mb-4">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">
            Articles dans la commande de{" "}
            <span className="text-primary font-bold">{order.client.name}</span>
          </h4>
          {order.orderItems.map((item: any) => (
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

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>MONTANT</FormLabel>
            </div>
            <div className="space-y-0.5">
              <FormLabel>{calculateTotalAmount()} MGA</FormLabel>
            </div>
          </div>

          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Payé</FormLabel>
                </div>
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

          <FormField
            control={form.control}
            name="isDelivered"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Livré</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSwitchDisabled("isDelivered")}
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

export default OrderUpdateForm;
