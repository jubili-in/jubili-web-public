"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

const NAVBAR_ROUTES = ["/", "/search", "/cart", "/user", "/favourite"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const showNavbar = NAVBAR_ROUTES.includes(pathname);

  if (!showNavbar) return null;

  return <Navbar />;
}
