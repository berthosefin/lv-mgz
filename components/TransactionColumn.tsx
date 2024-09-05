"use client";

import { ColumnDef } from "@tanstack/react-table";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      const formatted = new Date(date).toLocaleDateString("fr-FR");

      return formatted;
    },
  },
  {
    accessorKey: "label",
    header: "Libellé",
  },
  {
    accessorKey: "articles",
    header: "Article(s)",
    cell: ({ row }) => {
      const articles: Article[] = row.getValue("articles");
      const formatted =
        articles.length > 0 ? (
          <>
            {articles.slice(0, 3).map((article, index) => (
              <span key={index}>
                {article.name}
                {index !== articles.slice(0, 3).length - 1 && ", "}
              </span>
            ))}
            {articles.length > 3 && " ..."}
          </>
        ) : (
          <span className="line-through">Article</span>
        );

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Montant</div>,
    cell: ({ row }) => {
      const amount: number = row.getValue("amount");
      const formatted = amount.toLocaleString();

      return <div className={`text-right`}>{formatted} MGA</div>;
    },
  },
];
