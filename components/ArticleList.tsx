"use client";

import { LIMIT } from "@/lib/constant";
import { fetcher } from "@/lib/fetcher";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ArticleTable from "./ArticleTable";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

type Props = {
  userStore: Store;
};

const ArticleList = ({ userStore }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const totalPages = Math.ceil(articlesCount / (LIMIT || 1));

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
          <CardFooter className="flex justify-center space-x-4">
            <Button
              variant={"outline"}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage == 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant={"outline"} disabled>
              Page {currentPage} / {totalPages}
            </Button>
            <Button
              variant={"outline"}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage == totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ArticleList;
