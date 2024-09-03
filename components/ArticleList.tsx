"use client";

import { LIMIT } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ArticleTable from "./ArticleTable";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { useDebounce } from "use-debounce";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  userStore: Store;
};

const ArticleList = ({ userStore }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Appliquez le debounce au terme de recherche
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500 ms de délai

  const articleApiUrl = `${API_URL}/articles?storeId=${userStore.id}&page=${currentPage}&pageSize=${LIMIT}&search=${debouncedSearchTerm}`;
  const articleCountApiUrl = `${API_URL}/articles/count?storeId=${userStore.id}&search=${debouncedSearchTerm}`;

  const {
    data: articles,
    isLoading: articlesLoading,
    error: articlesError,
  } = useSWR(articleApiUrl, fetcher);

  const {
    data: articlesCount,
    isLoading: articlesCountLoading,
    error: articlesCountError,
  } = useSWR(articleCountApiUrl, fetcher);

  const totalPages = Math.ceil(articlesCount / (LIMIT || 1));

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          {(articlesError || articlesCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des articles." />
          )}
          <Input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </CardHeader>
        <CardContent>
          {articlesLoading || articlesCountLoading ? (
            <MyLoader />
          ) : (
            <ArticleTable articles={articles} apiUrl={articleApiUrl} />
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
