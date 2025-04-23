import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './context/AuthContext'
import Script from "next/script";
import KakaoInitializer from "@/components/KakaoInitializer";


export const metadata: Metadata = {
  title: 'MediGo',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon:'/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="ko">
      <body>
      <KakaoInitializer />
      {children}
      </body>
      </html>
  );

}
