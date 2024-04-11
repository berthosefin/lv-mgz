import MyCard from "@/components/MyCard";
import StockChart from "@/components/StockChart";
import TransactionTable from "@/components/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllArticles,
  getArticlesCount,
  getMaxStockArticle,
  getMinStockArticle,
} from "@/lib/articles";
import { getAllTransactions } from "@/lib/transactions";
import { getUserData } from "@/lib/users";
import {
  AlertTriangle,
  ArrowUpRight,
  ShoppingBasket,
  Store,
  Wallet,
} from "lucide-react";

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
            title={`Article${articlesCount >= 1 ? "s" : ""} dans le magasin`}
            value={articlesCount.toString()}
            icon={<ShoppingBasket />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`${
              minStockArticle
                ? `Stock min: ${minStockArticle.name}`
                : "Aucun article enregistré"
            }`}
            value={minStockArticle ? minStockArticle.stock.toString() : "0"}
            icon={<AlertTriangle />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title={`${
              maxStockArticle
                ? `Stock max: ${maxStockArticle.name}`
                : "Aucun article enregistré"
            }`}
            value={maxStockArticle ? maxStockArticle.stock.toString() : "0"}
            icon={<ArrowUpRight />}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <MyCard
            title="Solde de caisse"
            value={userCashDesk.currentAmount.toLocaleString() + " MGA"}
            icon={<Wallet />}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        {/* StockChart */}
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle>Stituation des stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <StockChart userStore={userStore} />
          </CardContent>
        </Card>

        {/* Lasts transactions */}
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle>Liste des 5 dernières transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
