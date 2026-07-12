import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/chat");
  }

  return <AppShell>{children}</AppShell>;
}
