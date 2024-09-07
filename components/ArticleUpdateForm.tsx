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
import { Input } from "@/components/ui/input";
import { replenishArticleAction } from "@/lib/actions/replenish-article";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  name: z.string(),
  purchasePrice: z.coerce.number().gte(1),
  sellingPrice: z.coerce.number().gte(1),
  stock: z.coerce.number().gte(1),
  unit: z.string(),
  replenishQuantity: z.coerce.number().gte(1),
});

export const ArticleUpdateForm = ({ article }: { article: Article }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { execute } = useServerAction(replenishArticleAction);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (article) {
      form.reset({
        ...article,
        replenishQuantity: 1,
      });
    }
  }, [article, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const [data, err] = await execute({
        id: article.id,
        replenishArticleData: values,
      });

      if (err) {
        toast({
          title: `${err.code}`,
          description: `${err.message}`,
          variant: `destructive`,
        });
      } else if (data) {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast({
          title: `Approvisionnement`,
          description: `Article approvisionné avec succès !`,
        });
        setOpen(false);
        form.reset();
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
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
                    disabled
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
                  <Input type="text" placeholder="Unité" disabled {...field} />
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
                  <Input
                    type="number"
                    placeholder="Prix d'achat"
                    disabled
                    {...field}
                  />
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
                  <Input
                    type="number"
                    placeholder="Prix de vente"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="grid grid-cols-2 gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Stock</legend>
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock actuel</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Stock actuel"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="replenishQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provision</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Provision" {...field} />
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
              <RefreshCw className="mr-2 h-4 w-4" />
              Approvisionner
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
          <Button variant="outline" size={"icon"}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Approvisionnement</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{Content}</div>
          <DrawerFooter className="pt-4">
            <DrawerClose asChild>
              <Button variant="outline">Annuler</Button>
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
          <RefreshCw className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approvisionnement</DialogTitle>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
};
