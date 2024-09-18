"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutAction } from "@/lib/actions/auth";
import { useUserStore } from "@/lib/store";
import { CircleUser, Menu, Store } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import CartSheet from "./CartSheet";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

const NavLinks = [
  { name: "Accueil", path: "/" },
  { name: "Articles", path: "/articles" },
  { name: "Commandes", path: "/orders" },
  { name: "Clients", path: "/clients" },
  { name: "Factures", path: "/invoices" },
  { name: "Caisse", path: "/cashdesks" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const { execute } = useServerAction(logoutAction);
  const { unSetUser } = useUserStore.getState();
  const router = useRouter();

  const isNavLinkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    const [data, err] = await execute();

    if (err) {
      toast.error(`${err.code}`, {
        description: `${err.message}`,
      });
      return;
    }

    if (data) {
      toast.success(`Déconnexion`, {
        description: `Utilisateur déconnectée avec succès !`,
      });

      unSetUser();
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Store className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        {NavLinks.map((link) => (
          <Link
            href={link.path}
            key={link.name}
            className={`${
              isNavLinkActive(link.path)
                ? "font-semibold text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Store className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            {NavLinks.map((link) => (
              <Link
                href={link.path}
                key={link.name}
                className={`${
                  isNavLinkActive(link.path)
                    ? "font-semibold hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Recherche..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div> */}
        </form>
        <CartSheet />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="capitalize">
              {user?.username}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/store");
              }}
            >
              Magasin
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
};
