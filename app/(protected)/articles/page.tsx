import { articleColumns } from "@/components/ArticleColumn";
import { ArticleDataTable } from "@/components/ArticleDataTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Liste des articles`,
};

export default async function ArticlesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="gap-4 md:gap-8">
        <ArticleDataTable columns={articleColumns} />
      </div>
    </main>
  );
}
