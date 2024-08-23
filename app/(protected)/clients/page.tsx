import ClientList from "@/components/ClientList";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/users";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Client() {
  const userData: User = await getUser();

  return (
    <>
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-4">
        <h1 className="text-3xl font-bold">Liste des clients</h1>
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-4">
          <Button asChild>
            <Link href={"/clients/add"} className="btn">
              <UserPlus size={16} className="mr-2 h-4 w-4" />
              Nouveau client
            </Link>
          </Button>
        </div>
      </div>
      <ClientList userStore={userData.store} />
    </>
  );
}
