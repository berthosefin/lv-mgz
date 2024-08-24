import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ToWords } from "to-words";

export const generatePDF = (invoice: Invoice) => {
  const doc = new jsPDF();
  const today = format(new Date(), "dd/MM/yyyy");

  // En-tête de la facture
  doc.setFontSize(12);
  doc.text(`${invoice.store.name}`, 15, 15);
  doc.text(`${invoice.store.status}`, 15, 20);
  doc.text(`${invoice.store.description}`, 15, 25);
  doc.text(`NIF: ${invoice.store.nif}`, 15, 30);
  doc.text(`STAT: ${invoice.store.stat}`, 15, 35);
  doc.text(`${invoice.store.address}`, 15, 40);
  doc.text(`Tel: ${invoice.store.phone}`, 15, 45);
  doc.text(`${invoice.store.city}`, 15, 50);
  doc.text(`Email: ${invoice.store.email}`, 15, 55);

  // Informations sur le client et le statut de la facture
  doc.setFontSize(12);
  doc.text(
    `Manakara le ${new Date(invoice.updatedAt).toLocaleDateString()}`,
    115,
    15
  );
  doc.text(`FACTURE N°: ${invoice.id}`, 85, 30);
  doc.text(`Doit: ${invoice.client.name}`, 115, 40);
  doc.text(`Adresse: ${invoice.store.city}`, 115, 45);

  // Colorier le statut en rouge
  doc.setTextColor(invoice.isPaid ? "black" : "red");
  doc.text(`${invoice.isPaid ? "PAYÉE" : "NON PAYÉE"}`, 115, 50);
  doc.setTextColor("black"); // Reset text color to black

  // Table des items de la facture
  const tableData = invoice.invoiceItems.map(
    (item, index) =>
      [
        index + 1,
        item.article.name,
        item.quantity,
        item.article.sellingPrice,
        item.quantity * item.article.sellingPrice,
      ] as (string | number)[]
  );

  // Ajouter la ligne pour le total
  const totalAmountRow: (string | number)[] = [
    "",
    "",
    "",
    "TOTAL",
    invoice.amount,
  ];
  tableData.push(totalAmountRow);

  // Générer le tableau
  const startY = 70;
  const rowHeight = 10; // Hauteur d'une ligne
  const totalRows = tableData.length + 1; // +1 pour la ligne d'en-tête
  const endY = startY + totalRows * rowHeight;

  autoTable(doc, {
    head: [
      ["#", "Désignation", "Quantité", "Prix Unitaire (MGA)", "Montant (MGA)"],
    ],
    body: tableData,
    startY: startY,
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    theme: "grid",
  });

  // Ligne d'arrêtage
  const toWords = new ToWords({
    localeCode: "fr-FR",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Ariary",
        plural: "Ariary",
        symbol: "MGA",
        fractionalUnit: {
          name: "Ariary",
          plural: "Ariary",
          symbol: "",
        },
      },
    },
  });
  doc.text(
    `Arrêtée la présente facture à la somme de ${toWords.convert(
      invoice.amount
    )}`,
    15,
    endY + 10
  );

  // Ajouter "Le Gérant"
  doc.text(`Le Gérant`, 150, endY + 30);

  // Sauvegarder le document
  doc.save(`facture_${invoice.client.name}_${today}.pdf`);
};
