"use client";

import { usePathname } from "next/navigation";
import { Navbar7 as Navbar } from "@/components/Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
