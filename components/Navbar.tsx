"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

import { logout } from "@/lib/auth.actions";
import { useUserStore } from "@/lib/store";
import { Loader2, LogOut, Store } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

const NavLinks = [
  { name: "Home", path: "/" },
  { name: "Articles", path: "/articles" },
  { name: "Commandes", path: "/orders" },
  { name: "Clients", path: "/clients" },
  { name: "Factures", path: "/invoices" },
  { name: "Caisse", path: "/cashdesks" },
];

const Navbar = () => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const isProtected = pathname !== "/login" && pathname !== "/signup";

  const isNavLinkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  const user = useUserStore((state) => state.user);
  const unSetUser = useUserStore((state) => state.unSetUser);

  async function onSubmit() {
    setBtnLoading(true);

    try {
      const result = await logout();

      if (result.success) {
        // router.push("/login");
        toast({
          description: `Compte déconnecté avec succès !`,
        });
        unSetUser();
      } else {
        toast({
          description: `Erreur lors de la déconnexion.`,
          variant: "destructive",
        });
      }
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  }

  return (
    <nav className="bg-background w-full border-b fixed z-10">
      <div className="flex justify-between items-center h-14">
        <div className="flex items-center space-x-4 ml-4">
          <Store size={16} />
          {isProtected &&
            NavLinks.map((link) => (
              <Link
                href={link.path}
                key={link.name}
                className={`${
                  isNavLinkActive(link.path)
                    ? "font-bold text-sm"
                    : "text-muted-foreground text-sm"
                }`}
              >
                {link.name}
              </Link>
            ))}
        </div>
        <div className="flex items-center mr-2">
          {isProtected && (
            <>
              <span className="text-sm text-muted-foreground capitalize mr-2">
                {user?.username}
              </span>
              {btnLoading ? (
                <Button disabled variant="ghost" size="icon">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
              ) : (
                <Button onClick={onSubmit} variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
