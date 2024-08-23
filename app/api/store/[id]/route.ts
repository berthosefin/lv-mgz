import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const storeData = await getStore(id);

  return Response.json(storeData);
}

export const getStore = async (id: string) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/store/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch store");

  return res.json();
};
