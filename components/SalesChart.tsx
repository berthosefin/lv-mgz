"use client";

import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { calculateMonthlyData } from "@/lib/calculate";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import { Skeleton } from "./ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Configuration du graphique
const chartConfig = {
  sales: {
    label: "Ventes",
    color: "hsl(var(--chart-1))",
  },
  purchases: {
    label: "Approvisionnements",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type Props = {
  storeId: string;
};

export function SalesChart({ storeId }: Props) {
  const currentYear = new Date().getFullYear();
  const {
    data: transactionsMonthlySummary,
    isLoading,
    error,
  } = useSWR(
    `${API_URL}/transactions/monthly-summary?storeId=${storeId}&year=${currentYear}`,
    fetcher
  );

  if (isLoading)
    return (
      <Card className="w-full lg:w-1/2">
        <CardHeader>
          <Skeleton className="h-4 w-[350px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <Skeleton className="h-4 w-[350px]" />
          <Skeleton className="h-4 w-[350px]" />
        </CardFooter>
      </Card>
    );

  if (error) return <ErrorMessage errorMessage="Erreur lors du chargement" />;

  const { revenueDifference } = calculateMonthlyData(
    transactionsMonthlySummary
  );

  // Transformation des données pour Recharts
  const transformedData = transactionsMonthlySummary.map(
    (item: any, index: number) => ({
      month: new Date(currentYear, index).toLocaleString("fr-FR", {
        month: "long",
      }),
      sales: item.sales,
      purchases: item.purchases,
    })
  );

  const isGrowth = revenueDifference > 0;
  const isNeutral = revenueDifference === 0;

  return (
    <Card className="w-full lg:w-1/2">
      <CardHeader>
        <CardTitle>Graphiques des Ventes et Approvisionnements</CardTitle>
        <CardDescription>Janvier - Décembre {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={transformedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: any) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            <Bar dataKey="purchases" fill="var(--color-purchases)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isNeutral ? (
            <>
              Le revenu est stable ce mois-ci <Activity className="h-4 w-4" />
            </>
          ) : isGrowth ? (
            <>
              Accroissement du revenu de {revenueDifference.toLocaleString()}{" "}
              MGA ce mois-ci <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Décroissement du revenu de{" "}
              {Math.abs(revenueDifference).toLocaleString()} MGA ce mois-ci{" "}
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage des ventes par rapport aux approvisionnements
        </div>
      </CardFooter>
    </Card>
  );
}
