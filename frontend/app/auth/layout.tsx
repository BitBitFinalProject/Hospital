import type { Metadata } from 'next'
import Image from "next/image"

export const metadata: Metadata = {
  title: '회원 인증 - MediGo',
  description: '회원가입 및 로그인을 통해 MediGo 서비스를 이용하세요',
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <header className="container mx-auto py-6 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative">
            <Image src="/logo.png" alt="MediGo 로고" fill sizes="40px" className="object-contain" />
          </div>
          <span className="text-2xl font-bold text-sky-500">MediGo</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="container mx-auto py-4 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} MediGo. All rights reserved.
      </footer>
    </div>
  )
} 