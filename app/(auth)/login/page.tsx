import { LoginForm } from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Se connecter`,
};

export default async function LoginPage() {
  return <LoginForm />;
}
