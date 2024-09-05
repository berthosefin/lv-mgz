import { SignupForm } from "@/components/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `S'inscrire`,
};

export default async function SignupPage() {
  return <SignupForm />;
}
