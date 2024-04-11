"use client";

import { fetcher } from "@/lib/fetcher";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";

ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip
);

const StockChart = ({ userStore }: { userStore: Store }) => {
  const { theme } = useTheme();

  const {
    data: articles,
    isLoading,
    error: articlesError,
  } = useSWR(
    `/api/articles?storeId=${userStore.id}&page=1&pageSize=25`,
    fetcher
  );

  if (isLoading) {
    return <MyLoader />;
  }

  if (articlesError) {
    return (
      <div className="mt-4">
        <ErrorMessage errorMessage="Erreur lors du chargement des articles." />
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="text-muted-foreground flex items-center">
        <AlertCircle size={16} className="mr-2" />
        Aucun article enregistré pour le moment
      </div>
    );
  }

  const labels = articles.map((article: Article) => article.name);
  const data = articles.map((article: Article) => article.stock);

  const barColor = theme !== "dark" ? "#000" : "#fff";

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Articles",
        },
      },
      y: {
        title: {
          display: true,
          text: "Stock",
        },
      },
    },
  };

  return (
    <Bar
      data={{
        labels: labels,
        datasets: [
          {
            label: "Stock",
            data: data,
            backgroundColor: barColor,
          },
        ],
      }}
      options={options}
    />
  );
};

export default StockChart;
