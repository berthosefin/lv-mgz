"use client";

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import ArticleTable from "./ArticleTable";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";
import MyPagination from "./MyPagination";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { LIMIT } from "@/lib/constant";

type Props = {
  currentPage: number;
  userStore: Store;
};

const ArticleList = ({ currentPage, userStore }: Props) => {
  const {
    data: articles,
    isLoading: articlesLoading,
    error: articlesError,
  } = useSWR(
    `/api/articles?storeId=${userStore.id}&page=${currentPage}&pageSize=${LIMIT}`,
    fetcher
  );

  const {
    data: articlesCount,
    isLoading: articlesCountLoading,
    error: articlesCountError,
  } = useSWR(`/api/articles/count?storeId=${userStore.id}`, fetcher);

  console.log("ART", articles);
  console.log("COUNT", articlesCount);

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          {(articlesError || articlesCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des articles." />
          )}
        </CardHeader>
        <CardContent>
          {articlesLoading || articlesCountLoading ? (
            <MyLoader />
          ) : (
            <ArticleTable articles={articles} />
          )}
        </CardContent>
        {articles && articlesCount > LIMIT && (
          <CardFooter>
            <MyPagination
              currentPage={currentPage}
              totalItems={articlesCount}
              path="/articles"
              limit={LIMIT}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ArticleList;
