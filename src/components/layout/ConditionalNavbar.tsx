"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

const STATIC_ROUTES = ["/", "/search", "/cart", "/user", "/favourite"];

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const showNavbar =
    STATIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/product/"); // <-- dynamic route support

  if (!showNavbar) return null;

  return <Navbar />;
}

