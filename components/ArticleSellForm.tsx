"use client";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { sellArticle } from "@/lib/articles.actions";
import { fetcher } from "@/lib/fetcher";
import clsx from "clsx";
import jsPDF from "jspdf";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Select from "react-select";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import Loader from "./MyLoader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, FileDown, RotateCw, X } from "lucide-react";
import { format } from "date-fns";
import autoTable from "jspdf-autotable";

type InvoiceItem = {
  articleId: string;
  quantity: number;
  sellingPrice: number;
};

const ArticleSellForm = ({ userData }: { userData: User }) => {
  const [clientName, setClientName] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const userStore = userData.store;
  const userCashDesk = userData.store.cashDesk;

  const {
    data: articles,
    isLoading,
    error: articlesError,
  } = useSWR(`/api/articles?storeId=${userStore.id}`, fetcher);

  if (articlesError) {
    setErrorMessage("Erreur lors du chargement des articles");
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity.toString());

    const selectedArticleData = articles.find(
      (article: Article) => article.id === selectedArticle
    );
    if (selectedArticleData && newQuantity > selectedArticleData.stock) {
      setErrorMessage(
        `La quantité ne peut pas dépasser le stock actuel de ${selectedArticleData.stock}.`
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    setClientName(e.target.value);
  };

  const handleAddToInvoice = () => {
    const newQuantity = parseInt(quantity);

    if (!selectedArticle || !newQuantity) {
      setErrorMessage(
        "L'article est obligatoire et la quantité doit être supérieur à 0 !"
      );
    } else {
      setErrorMessage("");
    }

    if (selectedArticle && newQuantity > 0) {
      const selectedArticleData = articles.find(
        (article: Article) => article.id === selectedArticle
      );
      if (selectedArticleData) {
        const item: InvoiceItem = {
          articleId: selectedArticleData.id,
          quantity: newQuantity,
          sellingPrice: selectedArticleData.sellingPrice,
        };
        setInvoiceItems([...invoiceItems, item]);
        setTotalAmount(
          totalAmount + newQuantity * selectedArticleData.sellingPrice
        );
      }
      setSelectedArticle("");
      setQuantity("");
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setInvoiceItems(invoiceItems.filter((_, index) => index !== indexToRemove));
  };

  const handleExportToPDF = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const doc = new jsPDF();
    const today = format(new Date(), "dd/MM/yyyy");

    doc.setFontSize(16);
    doc.text(`Nom: ${clientName}`, 15, 15);
    doc.text(`Date: ${today}`, 15, 22);
    doc.text(`FACTURE`, 90, 45);

    const tableData = invoiceItems.map(
      (invoice: InvoiceItem, index: number) => {
        const { articleId, quantity, sellingPrice } = invoice;

        const articleName = articles.find(
          (article: Article) => article.id === articleId
        )?.name;

        const amount = quantity * sellingPrice;

        return [index + 1, articleName, quantity, sellingPrice, amount];
      }
    );

    const totalAmountRow = ["", "", "", "TOTAL", totalAmount];
    tableData.push(totalAmountRow);

    autoTable(doc, {
      head: [
        [
          "#",
          "Designation",
          "Quantité",
          "Prix Unitaire (MGA)",
          "Montant (MGA)",
        ],
      ],
      body: tableData,
      startY: 50,
      columnStyles: {
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
    });

    doc.save(`facture_de_${clientName}_du_${today}.pdf`);
  };

  const handleSubmit = async () => {
    setBtnLoading(true);

    const articleIds = invoiceItems.map((item) => item.articleId);
    const sellQuantities = invoiceItems.map((item) => item.quantity);

    const sellArticleData = {
      articles: articleIds,
      sellQuantities: sellQuantities,
      cashDeskId: userCashDesk.id,
    };

    await sellArticle(sellArticleData);

    toast({
      title: `Vente d'article`,
      description: `La vente d'article a été effectué avec succès !`,
    });

    setClientName("");
    setBtnLoading(false);
    router.push("/articles");
  };

  return (
    <>
      {errorMessage && (
        <div className="mb-4">
          <ErrorMessage errorMessage={errorMessage} />
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-4">
          <Input
            className="lg:w-[180px]"
            placeholder="Nom du client"
            value={clientName}
            onChange={handleClientNameChange}
          />

          <div className="flex flex-col space-y-4 lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-4">
            <Select
              value={
                selectedArticle
                  ? {
                      value: selectedArticle,
                      label: articles.find(
                        (article: Article) => article.id === selectedArticle
                      )?.name,
                    }
                  : null
              }
              onChange={(option) =>
                setSelectedArticle(option ? option.value : "")
              }
              options={articles
                .filter(
                  (article: Article) =>
                    !invoiceItems.some((item) => item.articleId === article.id)
                )
                .map((article: Article) => ({
                  value: article.id,
                  label: article.name,
                }))}
              isSearchable
              isClearable
              placeholder="Selectionner un article"
              unstyled
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  minHeight: "2.5rem",
                  height: "2.5rem",
                  minWidth: "16rem",
                }),
                clearIndicator: (baseStyles) => ({
                  ...baseStyles,
                  "& svg": {
                    width: "14px",
                    height: "14px",
                  },
                }),
                dropdownIndicator: (baseStyles) => ({
                  ...baseStyles,
                  "& svg": {
                    width: "14px",
                    height: "14px",
                  },
                }),
              }}
              classNames={{
                control: ({ isFocused }) =>
                  clsx(
                    isFocused ? "border-input" : "border-border",
                    "border rounded-md text-sm"
                  ),
                placeholder: () => "text-muted-foreground px-3",
                input: () => "px-3",
                valueContainer: () => "px-3",
                clearIndicator: () =>
                  "text-muted-foreground hover:text-destructive",
                dropdownIndicator: () =>
                  "text-muted-foreground px-3 hover:text-primary",
                menu: () =>
                  "px-3 py-2 mt-2 border border-border bg-background rounded-md",
                option: ({ isFocused, isSelected }) =>
                  clsx(
                    isFocused && "bg-secondary",
                    isSelected && "font-bold",
                    "text-sm hover:cursor-pointer px-3 py-2 rounded"
                  ),
                noOptionsMessage: () =>
                  "px-3 py-2 bg-background text-muted-foreground",
              }}
            />

            <Input
              className="lg:w-[180px]"
              type="number"
              placeholder="Quantité"
              value={quantity}
              onChange={handleQuantityChange}
            />

            <Button
              disabled={errorMessage ? true : false}
              onClick={handleAddToInvoice}
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      )}

      {invoiceItems.length > 0 && (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead className="w-[100px] text-right">Quantité</TableHead>
              <TableHead className="text-right">Prix Unitaire</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[56px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {
                    articles.find(
                      (article: Article) => article.id === item.articleId
                    )?.name
                  }
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {item.sellingPrice.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {(item.quantity * item.sellingPrice).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X size={16} className="text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-4">
                  <Button
                    disabled={errorMessage || clientName == "" ? true : false}
                    onClick={handleExportToPDF}
                    variant="ghost"
                  >
                    <FileDown size={16} />
                  </Button>

                  <div className="font-bold">
                    <span>TOTAL:</span>
                    <span className="ml-2">{totalAmount.toLocaleString()}</span>
                    <span className="ml-2">MGA</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {btnLoading ? (
                  <Button disabled>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Chargement
                  </Button>
                ) : (
                  <Button
                    disabled={errorMessage ? true : false}
                    onClick={handleSubmit}
                  >
                    <Check size={16} className="mr-2 h-4 w-4" />
                    Valider
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ArticleSellForm;
