import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/src/components/Providers";
import { UploadProvider } from '@/src/contexts/UploadContext';
import GlobalUploadWidget from "@/src/components/Widget/GlobalUploadWidget";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Chamados e Procedimentos",
  description: "Gerenciador de scripts e procedimentos operacionais",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <UploadProvider>
          <Providers>
            {children}
            {/* O widget agora roda aqui dentro, tendo acesso total ao tCommon */}
            <GlobalUploadWidget />
          </Providers>
        </UploadProvider>
      </body>
    </html>
  );
}