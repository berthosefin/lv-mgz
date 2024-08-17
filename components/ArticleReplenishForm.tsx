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

const formSchema = z.object({
  replenishQuantity: z.coerce.number(),
  cashDeskId: z.optional(z.string()),
});

type Props = {
  articleId: string;
  userCashDesk: CashDesk;
};

const ArticleReplenishForm = ({ articleId, userCashDesk }: Props) => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: article,
    isLoading,
    error: articleError,
  } = useSWR(`/api/articles/${articleId}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { replenishQuantity: 0 },
  });

  const handleReplenishQuantityChange = (value: string) => {
    const totalCost = parseInt(value) * article.purchasePrice;

    if (totalCost > userCashDesk.currentAmount) {
      setErrorMessage("Solde insuffisant dans la caisse.");
    } else {
      setErrorMessage("");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    values.cashDeskId = userCashDesk.id;

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
                      handleReplenishQuantityChange(e.target.value);
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
