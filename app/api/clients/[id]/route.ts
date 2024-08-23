import { getClient } from "@/lib/clients";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const clientData = await getClient(id);

  return Response.json(clientData);
}
