import { ArticleDataTable } from "@/components/ArticleDataTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Articles`,
};

export default async function ArticlesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="space-y-2 px-2">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Articles
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérez et visualisez vos articles.
        </p>
      </div>
      <ArticleDataTable />
    </main>
  );
}
