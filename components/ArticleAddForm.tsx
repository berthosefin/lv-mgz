"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import MyButton from "./MyButton";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { addArticle } from "@/lib/articles.actions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
  name: z.string(),
  purchasePrice: z.coerce.number(),
  sellingPrice: z.coerce.number(),
  stock: z.coerce
    .number()
    .int()
    .max(
      2147483647,
      "La valeur du stock doit être inférieure à 2,147,483,647."
    ),
  unit: z.string(),
  storeId: z.optional(z.string()),
});

const ArticleAddForm = ({ userData }: { userData: User }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const userStore = userData.store;
  // const userCashDesk = userData.store.cashDesk;

  const { data: articles, error: articlesError } = useSWR(
    `${API_URL}/articles?storeId=${userStore.id}`,
    fetcher
  );

  if (articlesError) {
    setErrorMessage("Erreur lors du chargement des articles");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { watch } = form;

  const handleArticleNameChange = async (value: string) => {
    if (!articles) return;

    const articleExists = articles.some(
      (article: Article) => article.name === value
    );

    if (articleExists) {
      setErrorMessage("Nom d'article déjà prise");
    } else {
      setErrorMessage("");
    }
  };

  // const handlePurchasePriceChange = async (value: string) => {
  //   const purchasePrice = parseFloat(value);
  //   const stockValue = watch("stock");
  //   const totalCost = stockValue * purchasePrice;

  //   if (totalCost > userCashDesk.currentAmount) {
  //     setErrorMessage("Solde insuffisant dans la caisse.");
  //   } else {
  //     setErrorMessage("");
  //   }
  // };

  // const handleStockChange = async (value: string) => {
  //   const stockValue = parseInt(value);
  //   const purchasePrice = watch("purchasePrice");
  //   const totalCost = stockValue * purchasePrice;

  //   if (totalCost > userCashDesk.currentAmount) {
  //     setErrorMessage("Solde insuffisant dans la caisse.");
  //   } else {
  //     setErrorMessage("");
  //   }
  // };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    values.storeId = userStore.id;

    await addArticle(values);

    toast({
      title: `Ajout d'article: ${values.name}`,
      description: `L'article a été ajouté avec succès !`,
    });

    form.reset();
    setBtnLoading(false);
    router.push("/articles");
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
              <FormLabel>Nom de l&apos;article</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nom de l'article"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleArticleNameChange(e.target.value);
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
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix d&apos;achat (MGA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Prix d'achat (MGA)"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // handlePurchasePriceChange(e.target.value);
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
          name="sellingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix de vente (MGA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Prix de vente (MGA)"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <div className="w-full">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock initial</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Stock initial"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // handleStockChange(e.target.value);
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
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unité</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Unité"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

        <MyButton
          label="Ajouter"
          loading={btnLoading}
          errorMessage={errorMessage}
        />
      </form>
    </Form>
  );
};

export default ArticleAddForm;
