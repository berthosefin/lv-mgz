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
  getAllArticles,
  getArticlesCount,
  getMaxStockArticle,
  getMinStockArticle,
} from "@/lib/articles";
import { getAllTransactions } from "@/lib/transactions";
import { getUserData } from "@/lib/users";
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
  const userData: User = await getUserData();
  const userStore: Store = userData.store;
  const userCashDesk: CashDesk = userData.store.cashDesk;

  const [articles, articlesCount, transactions] = await Promise.all([
    getAllArticles(userStore.id),
    getArticlesCount(userStore.id),
    getAllTransactions(userCashDesk.id, 1, 5),
  ]);

  const minStockArticle = getMinStockArticle(articles);
  const maxStockArticle = getMaxStockArticle(articles);

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
            value={`500 000`}
            description={`+20.1% depuis le mois dernier`}
            icon={<DollarSign />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`Résumé des Ventes`}
            value={`300`}
            description={`+19% depuis le mois dernier`}
            icon={<CreditCard />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`Résumé des Approvisionnements`}
            value={`250`}
            description={`+180.1% depuis le mois dernier`}
            icon={<Plus />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`Résumé des Stocks`}
            value={`500`}
            description={`Produits en Stock`}
            icon={<Activity />}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        {/* SalesChart */}
        <Card className="w-full lg:w-1/2">
          <SalesChart />
        </Card>

        {/* Lasts transactions */}
        <Card className="w-full lg:w-1/2">
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
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <div className="flex">
              <div className="flex flex-col gap-2">
                <CardTitle>Alertes de Stock</CardTitle>
                <CardDescription>
                  Article en cours d&apos;epuisement de stock.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/articles">
                  Voir page des article
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            Pas encore d&apos;article en cours d&apos;epuisement de stock.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
