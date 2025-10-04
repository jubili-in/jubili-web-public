// //
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ToastProvider } from '@/contexts/ToastContext';
// import { ToastContainer } from '@/components/ui/ToastContainer';
// import { NavbarTop } from "@/components/layout/NavbarTop";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Jubili",
//   description: "next gen ecommerce platform",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} antialiased`}>
//         <ToastProvider>
//             <NavbarTop />
//             {children}
//             <ToastContainer />
//         </ToastProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { NavbarTop } from "@/components/layout/NavbarTop";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jubili",
  description: "next gen ecommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <NavbarTop />
          {/* Wrap the main page content in a container */}
          <div id="page-content" className="transition duration-300">
            {children}
          </div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
