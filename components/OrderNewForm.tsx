"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/fetcher";
import { createOrder } from "@/lib/orders.actions";
import clsx from "clsx";
import { Check, RotateCw, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Select from "react-select";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import { Loader } from "./Loader";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type OrderItem = {
  articleId: string;
  quantity: number;
  sellingPrice: number;
};

const OrderNewForm = ({ userData }: { userData: User }) => {
  const [clientName, setClientName] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [isDelivered, setIsDelivered] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  const userStore = userData.store;

  const {
    data: articles,
    isLoading,
    error: articlesError,
  } = useSWR(`${API_URL}/articles?storeId=${userStore.id}`, fetcher);

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

  const handleAddToOrder = () => {
    const newQuantity = parseInt(quantity);

    if (!selectedArticle || !newQuantity || newQuantity <= 0) {
      setErrorMessage(
        "L'article est obligatoire et la quantité doit être supérieur à 0 !"
      );
      return;
    }

    const selectedArticleData = articles.find(
      (article: Article) => article.id === selectedArticle
    );
    if (selectedArticleData) {
      const item: OrderItem = {
        articleId: selectedArticleData.id,
        quantity: newQuantity,
        sellingPrice: selectedArticleData.sellingPrice,
      };
      setOrderItems([...orderItems, item]);
      setTotalAmount(
        totalAmount + newQuantity * selectedArticleData.sellingPrice
      );
      setSelectedArticle("");
      setQuantity("");
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const itemToRemove = orderItems[indexToRemove];
    const newOrderItems = orderItems.filter(
      (_, index) => index !== indexToRemove
    );

    // Mettre à jour le montant total en soustrayant le montant de l'article supprimé
    setTotalAmount(
      totalAmount - itemToRemove.quantity * itemToRemove.sellingPrice
    );

    setOrderItems(newOrderItems);
  };

  const handleSubmitOrder = async () => {
    if (clientName.trim() === "") {
      setErrorMessage("Le nom du client est obligatoire !");
      return;
    }

    setBtnLoading(true);

    const newOrder = {
      storeId: userStore.id,
      clientName: clientName.toLocaleLowerCase(),
      isPaid,
      isDelivered,
      orderItems: orderItems.map((item) => ({
        articleId: item.articleId,
        quantity: item.quantity,
      })),
    };

    try {
      await createOrder(newOrder);
      toast({
        title: "Nouvelle commande",
        description: "La commande a été créée avec succès !",
      });
      router.push("/orders");
    } catch (error) {
      setErrorMessage("Erreur lors de la création de la commande.");
    } finally {
      setBtnLoading(false);
    }
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
          <div className="flex space-x-4 items-center">
            <Input
              className="lg:w-[180px]"
              placeholder="Nom du client"
              value={clientName}
              onChange={handleClientNameChange}
            />
            <Label className="flex items-center text-primary">
              <Checkbox
                checked={isPaid}
                onCheckedChange={(checked) => {
                  if (!checked && !isDelivered) {
                    // Si isPaid est décoché alors que isDelivered est déjà décoché, on ne fait rien
                    return;
                  }
                  setIsPaid(checked === true);
                }}
                className="mr-2"
              />
              Payé
            </Label>
            <Label className="flex items-center text-primary">
              <Checkbox
                checked={isDelivered}
                onCheckedChange={(checked) => {
                  if (!checked && !isPaid) {
                    // Si isDelivered est décoché alors que isPaid est déjà décoché, on ne fait rien
                    return;
                  }
                  setIsDelivered(checked === true);
                }}
                className="mr-2"
              />
              Livré
            </Label>
          </div>

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
                    !orderItems.some((item) => item.articleId === article.id)
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
                control: (baseStyles) => ({
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
              onClick={handleAddToOrder}
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      )}

      {orderItems.length > 0 && (
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
            {orderItems.map((item, index) => (
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
                    disabled={
                      errorMessage || clientName.trim() === "" ? true : false
                    }
                    onClick={handleSubmitOrder}
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

export default OrderNewForm;
