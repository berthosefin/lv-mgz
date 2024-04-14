"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/lib/transactions.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import MyButton from "./MyButton";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  amount: z.coerce.number(),
  label: z.string(),
  articles: z.optional(z.array(z.string())),
  cashDeskId: z.optional(z.string()),
});

const CashDeskOperationForm = ({
  userCashDesk,
}: {
  userCashDesk: CashDesk;
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { watch } = form;

  const handleAmountChange = (value: string) => {
    const amountValue = parseFloat(value);

    const type = watch("type");

    if (type === "OUT" && amountValue > userCashDesk.currentAmount) {
      setErrorMessage(
        "Le montant actuel de la caisse est insuffisant pour effectuer le retrait."
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleTypeChange = (value: "IN" | "OUT") => {
    const amountValue = watch("amount");

    if (value === "OUT" && amountValue > userCashDesk.currentAmount) {
      setErrorMessage(
        "Le montant actuel de la caisse est insuffisant pour effectuer le retrait."
      );
    } else {
      setErrorMessage("");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBtnLoading(true);

    values.articles = [];
    values.cashDeskId = userCashDesk.id;

    await createTransaction(values);

    toast({
      title: `${values.type === "OUT" ? "Rétrait" : "Dépot"}`,
      description: `${
        values.type === "OUT" ? "Rétrait" : "Dépot"
      } effectué avec succès !`,
    });

    form.reset();
    setBtnLoading(false);
    router.push("/cashdesks");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d&apos;opération</FormLabel>
                  <Select
                    onValueChange={(value: "IN" | "OUT") => {
                      field.onChange(value);
                      handleTypeChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type d'opération" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IN">Dépôt</SelectItem>
                      <SelectItem value="OUT">Retrait</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (MGA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Montant (MGA)"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleAmountChange(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Libellé"
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

          <MyButton
            label="Valider"
            loading={btnLoading}
            errorMessage={errorMessage}
          />
        </div>
      </form>
    </Form>
  );
};

export default CashDeskOperationForm;
