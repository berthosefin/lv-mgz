"use client";

import ErrorMessage from "@/components/ErrorMessage";
import MyButton from "@/components/MyButton";
import Loader from "@/components/MyLoader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { replenishArticle } from "@/lib/articles.actions";
import { fetcher } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
  replenishQuantity: z.coerce
    .number()
    .int()
    .max(
      2147483647,
      "La valeur du stock doit être inférieure à 2,147,483,647."
    ),
  cashDeskId: z.optional(z.string()),
});

type Props = {
  articleId: string;
};

const ArticleReplenishForm = ({ articleId }: Props) => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: article,
    isLoading,
    error: articleError,
  } = useSWR(`${API_URL}/articles/${articleId}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { replenishQuantity: 0 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    await replenishArticle(articleId, values);

    toast({
      title: `Réapprovisionnement: ${article?.name}`,
      description: `L'article a été réapprovisionné avec succès !`,
    });

    form.reset();
    setBtnLoading(false);
    router.push("/articles");
  }

  if (articleError) {
    return (
      <div className="mt-4">
        <ErrorMessage errorMessage="Erreur lors du chargement de l'article" />
      </div>
    );
  }

  return (
    <>
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

      {isLoading && <Loader />}

      {article && (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Article</TableCell>
              <TableCell className="text-end">{article?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Prix d&apos;achat</TableCell>
              <TableCell className="text-end">
                {article?.purchasePrice.toLocaleString()}
                <span className="ml-2">MGA</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Prix de vente</TableCell>
              <TableCell className="text-end">
                {article?.sellingPrice.toLocaleString()}
                <span className="ml-2">MGA</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Stock actuel</TableCell>
              <TableCell className="text-end">
                {article?.stock.toLocaleString()}
                <span className="ml-2">{article?.unit}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FormField
            control={form.control}
            name="replenishQuantity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantité"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      // handleReplenishQuantityChange(e.target.value);
                      field.onChange(e);
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MyButton
            label="Approvisionner"
            loading={btnLoading}
            errorMessage={errorMessage}
            icon={<RefreshCw size={16} className="mr-2 h-4 w-4" />}
          />
        </form>
      </Form>
    </>
  );
};

export default ArticleReplenishForm;
