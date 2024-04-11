const API_URL = process.env.API_URL;

export const getCashDesk = async (id: string) => {
  const res = await fetch(`${API_URL}/cashDesks/${id}`, { cache: "no-store" });

  if (!res.ok) throw new Error("failed to fetch cash desk");

  return res.json();
};
