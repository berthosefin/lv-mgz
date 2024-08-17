export function calculateDifference(
  previousValue: number,
  currentValue: number
) {
  return currentValue - previousValue;
}

export function calculateMonthlyData(
  transactionsMonthlySummary: { sales: number; purchases: number }[]
) {
  const currentMonthIndex = new Date().getMonth(); // Mois actuel (index basé sur 0)
  const previousMonthIndex =
    currentMonthIndex - 1 >= 0 ? currentMonthIndex - 1 : 11; // Mois précédent (si janvier, on prend décembre de l'année précédente)

  const currentMonthData = transactionsMonthlySummary[currentMonthIndex] || {
    sales: 0,
    purchases: 0,
  };
  const previousMonthData = transactionsMonthlySummary[previousMonthIndex] || {
    sales: 0,
    purchases: 0,
  };

  const currentMonthRevenue =
    currentMonthData.sales - currentMonthData.purchases;
  const previousMonthRevenue =
    previousMonthData.sales - previousMonthData.purchases;

  return {
    currentMonthRevenue,
    previousMonthRevenue,
    revenueDifference: calculateDifference(
      previousMonthRevenue,
      currentMonthRevenue
    ),
    currentMonthSales: currentMonthData.sales,
    previousMonthSales: previousMonthData.sales,
    salesDifference: calculateDifference(
      previousMonthData.sales,
      currentMonthData.sales
    ),
    currentMonthPurchases: currentMonthData.purchases,
    previousMonthPurchases: previousMonthData.purchases,
    purchasesDifference: calculateDifference(
      previousMonthData.purchases,
      currentMonthData.purchases
    ),
  };
}
