"use client";

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
import { addArticleAction } from "@/lib/actions/add-article";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  name: z.string(),
  purchasePrice: z.coerce.number().gte(1),
  sellingPrice: z.coerce.number().gte(1),
  stock: z.coerce.number().gte(1),
  unit: z.string(),
  storeId: z.string().optional(),
});

export const ArticleAddForm = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { user } = useUserStore.getState();
  const { execute, isPending } = useServerAction(addArticleAction);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.storeId = user?.storeId;
    const [data, err] = await execute(values);

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
    } else if (data) {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: `Ajout article`,
        description: `Article ajoutée avec succès !`,
      });
      setOpen(false);
      form.reset();
    }
  }

  const Content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <fieldset className="grid grid-cols-2 gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Article</legend>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l&apos;article</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nom de l'article"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unité</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Unité" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="grid grid-cols-2 gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Prix</legend>
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix d&apos;achat</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Prix d'achat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de vente</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Prix de vente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="grid grid-cols-1 gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Stock</legend>
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock initial</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Stock initial" {...field} />
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
              Chargement..
            </span>
          ) : (
            <span className="flex">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter
            </span>
          )}
        </Button>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>
            <PlusCircle className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nouvel</DrawerTitle>
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
        <Button className="ml-auto">
          <PlusCircle className="mr-2 w-4 h-4" />
          <span className="hidden sm:block">Ajouter article</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvel</DialogTitle>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
};
