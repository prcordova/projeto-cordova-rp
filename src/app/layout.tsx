import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AppToaster } from "@/components/toast";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cordova RP",
  description: "Cidade Cordova RP. Loja, notícias e conexão."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.className} flex min-h-screen flex-col overflow-x-clip`}>
        <AppToaster />
        <Header />
        <CartDrawer />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
