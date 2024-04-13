import ArticleList from "@/components/ArticleList";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/lib/users";
import { HandCoins, Plus } from "lucide-react";
import Link from "next/link";

export default async function Article() {
  const userData: User = await getUserData();
  const userStore: Store = userData.store;

  return (
    <>
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-4">
        <h1 className="text-3xl font-bold">Liste des articles</h1>
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-4">
          <Button asChild>
            <Link href={"/articles/add"} className="btn">
              <Plus size={16} className="mr-2 h-4 w-4" />
              Ajouter un article
            </Link>
          </Button>
          <Button asChild>
            <Link href={"/articles/sell"} className="btn">
              <HandCoins size={16} className="mr-2 h-4 w-4" />
              Vendre un article
            </Link>
          </Button>
        </div>
      </div>
      <ArticleList userStore={userStore} />
    </>
  );
}
