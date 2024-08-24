import MyCard from "@/components/MyCard";
import { SalesChart } from "@/components/SalesChart";
import TransactionTable from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getArticlesCount, getLowStockArticles } from "@/lib/articles";
import { calculateMonthlyData } from "@/lib/calculate";
import {
  getAllTransactions,
  getTransactionsMonthlySummary,
} from "@/lib/transactions";
import { getUser } from "@/lib/users";
import { Article } from "@prisma/client";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Plus,
  Store,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const userData: User = await getUser();
  const userStore: Store = userData.store;
  const userCashDesk: CashDesk = userData.store.cashDesk;

  const [
    articlesCount,
    transactions,
    transactionsMonthlySummary,
    lowStockArticles,
  ] = await Promise.all([
    getArticlesCount(userStore.id),
    getAllTransactions(userCashDesk.id, 1, 5),
    getTransactionsMonthlySummary(userStore.id, new Date().getFullYear()),
    getLowStockArticles(userStore.id),
  ]);

  // Utilisez la fonction pour obtenir les données calculées
  const {
    currentMonthRevenue,
    revenueDifference,
    currentMonthSales,
    salesDifference,
    currentMonthPurchases,
    purchasesDifference,
  } = calculateMonthlyData(transactionsMonthlySummary);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>
        <h1 className="text-3xl font-bold mb-4 capitalize flex items-center">
          <Store size={20} className="mr-2" />
          {userStore.name}
        </h1>
      </div>

      {/* Cards */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`Total Revenue`}
            value={`${currentMonthRevenue.toLocaleString("fr-FR")} MGA`}
            description={`${
              revenueDifference > 0
                ? `+${revenueDifference.toLocaleString(
                    "fr-FR"
                  )} MGA depuis le mois dernier`
                : `-${Math.abs(revenueDifference).toLocaleString(
                    "fr-FR"
                  )} MGA depuis le mois dernier`
            }`}
            icon={<DollarSign />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`Résumé des Ventes`}
            value={`${currentMonthSales.toLocaleString("fr-FR")} MGA`}
            description={`${
              salesDifference > 0
                ? `+${salesDifference.toLocaleString(
                    "fr-FR"
                  )} MGA depuis le mois dernier`
                : `-${Math.abs(salesDifference).toLocaleString(
                    "fr-FR"
                  )} MGA depuis le mois dernier`
            }`}
            icon={<CreditCard />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`Résumé des Approvisionnements`}
            value={`${currentMonthPurchases.toLocaleString("fr-FR")} MGA`}
            description={`${
              purchasesDifference > 0
                ? `+${purchasesDifference.toLocaleString(
                    "fr-FR"
                  )} MGA depuis le mois dernier`
                : `-${Math.abs(purchasesDifference).toLocaleString(
                    "fr-FR"
                  )} MGA depuis le mois dernier`
            }`}
            icon={<Plus />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`Résumé des Stocks`}
            value={`${articlesCount}`}
            description={`Produits en Stock`}
            icon={<Activity />}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        {/* SalesChart */}
        <Card className="w-full lg:w-1/2">
          <SalesChart transactionsMonthlySummary={transactionsMonthlySummary} />
        </Card>

        {/* Lasts transactions */}
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex">
              <div className="flex flex-col gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Historique des Transactions.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/cashdesks">
                  Voir tout
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionTable transactions={transactions} />
          </CardContent>
        </Card>

        {/* Alert */}
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <div className="flex">
              <div className="flex flex-col gap-2">
                <CardTitle>Alertes</CardTitle>
                <CardDescription>Epuisement de stock.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/articles">
                  Voir page des articles
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead className="text-end">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockArticles.length > 0 ? (
                  lowStockArticles.map((article: Article) => (
                    <TableRow key={article.id}>
                      <TableCell>{article.name}</TableCell>
                      <TableCell className="text-end">
                        {article.stock}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div className="text-muted-foreground py-4">
                    Pas encore d&apos;articles en cours d&apos;épuisement de
                    stock.
                  </div>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
