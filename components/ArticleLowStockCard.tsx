import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectSeparator } from "@/components/ui/select";
import { getArticlesLowStock } from "@/lib/get-articles-low-stock";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const ArticleLowStockCard = async ({ storeId }: { storeId: string }) => {
  const lowStockArticles = await getArticlesLowStock(storeId);

  return (
    <Card className="w-full lg:w-1/3">
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col gap-2">
            <CardTitle>Alertes</CardTitle>
            <CardDescription>Epuisement de stock.</CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/articles">
              Voir tout
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {lowStockArticles.length > 0 ? (
          <ScrollArea className="h-80 w-full rounded-md border mb-4">
            <div className="p-4">
              {lowStockArticles.map((item: Article) => (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between">
                    <div>{item.name}</div>
                    <div>{item.stock}</div>
                  </div>
                  <SelectSeparator className="my-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground py-4">
            Pas encore d&apos;articles en cours d&apos;épuisement de stock.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
