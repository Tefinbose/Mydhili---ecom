
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InitialPreloader from "@/components/common/InitialPreloader";
import LoadingScreen from "@/components/common/LoadingScreen";
import RouteProgressBar from "@/components/common/RouteProgressBar";

function StorefrontLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <RouteProgressBar />
      <InitialPreloader />
      <Navbar />
      <main className="animate-page-reveal">{children}</main>
      <Footer />
    </>
  );
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <LoadingScreen fullScreen theme="royal-maroon" duration={1400} />
      }
    >
      <StorefrontLayoutContent>
        {children}
      </StorefrontLayoutContent>
    </Suspense>
  );
}
