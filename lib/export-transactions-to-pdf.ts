import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportTransactionsToPdf = (
  transactions: Transaction[],
  currency: string,
  startDate: string,
  endDate: string
) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(
    `Liste des transactions du ${new Date(
      startDate
    ).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`,
    15,
    15
  );

  const tableData = transactions.map(
    (transaction: Transaction, index: number) => {
      const { createdAt, label, articles, amount } = transaction;

      // Format date
      const formattedDate = new Date(createdAt).toLocaleDateString();

      // Transform label
      let formattedLabel = label;
      if (label === "STOCK IN") {
        formattedLabel = "ACHAT";
      } else if (label === "STOCK OUT") {
        formattedLabel = "VENTE";
      }

      // Get articles names
      const articleNames = articles.map((article) => article.name).join(", ");

      return [index + 1, formattedDate, formattedLabel, articleNames, amount];
    }
  );

  autoTable(doc, {
    head: [["#", "Date", "Libellé", "Article(s)", `Montant (${currency})`]],
    body: tableData,
    startY: 20,
    columnStyles: {
      4: { halign: "right" },
    },
  });

  doc.save(`liste_des_transactions_du_${startDate}_au_${endDate}.pdf`);
};
