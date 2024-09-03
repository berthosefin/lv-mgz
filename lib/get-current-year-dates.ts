export const getCurrentYearDates = () => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`);
  const endDate = new Date(`${currentYear + 1}-01-01T00:00:00Z`);
  return { startDate, endDate };
};
