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
import { updateStoreAction } from "@/lib/actions/store";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { getStore } from "@/lib/services/stores";

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

export const StoreForm = () => {
  const { user } = useUserStore.getState();
  const { execute, isPending: isServerAction } =
    useServerAction(updateStoreAction);
  const queryClient = useQueryClient();

  const { data, isPending: isQueryPending } = useQuery({
    queryKey: ["store"],
    queryFn: () => getStore(user?.storeId as string),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [data, err] = await execute({
      id: user?.storeId as string,
      storeData: values,
    });

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
    } else if (data) {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast({
        title: `Mise à jour`,
        description: `La mise à jour des informations sur le magasin a été effectuée avec succès !`,
      });
      form.reset();
    }
  }

  if (isQueryPending) {
    return <Loader />;
  }

  return (
    <div className="overflow-x-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg">
          <div className="grid gap-4">
            {/* Section: Informations de base */}
            <fieldset className="grid grid-cols-2 gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Informations de base
              </legend>
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
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* Section: Informations fiscales */}
            <fieldset className="grid grid-cols-2 gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Informations fiscales
              </legend>
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
            </fieldset>

            {/* Section: Détails de contact */}
            <fieldset className="grid grid-cols-2 gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Détails de contact
              </legend>
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
            </fieldset>
          </div>

          <Button
            type="submit"
            disabled={isServerAction}
            className="w-full mt-4"
          >
            {isServerAction ? (
              <span className="flex">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </span>
            ) : (
              <span className="flex">
                <Edit3 className="mr-2 h-4 w-4" />
                Mettre à jour
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
