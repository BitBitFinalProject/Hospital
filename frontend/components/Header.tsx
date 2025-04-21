"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Search, User, Menu, LogOut } from "lucide-react"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="MediGo 로고" width={40} height={40} className="w-10 h-10" />
          <span className="text-2xl font-bold text-sky-500">MediGo</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-sky-500 transition-colors">
            홈
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-sky-500 transition-colors">
            진료예약
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-sky-500 transition-colors">
            의료진 소개
          </Link>
          <Link href="/hospitals" className="text-sm font-medium hover:text-sky-500 transition-colors">
            병원 목록
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-sky-500 transition-colors">
            고객센터
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">검색</span>
          </Button>

          {isAuthenticated ? (
            <>
              <Link href="/mypage">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                  <span className="sr-only">마이페이지</span>
                </Button>
              </Link>
              <Button 
                onClick={logout} 
                className="hidden md:flex bg-red-500 hover:bg-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button className="hidden md:flex bg-sky-500 hover:bg-sky-600">로그인</Button>
              </Link>
              <Link href="/auth/register" className="hidden md:flex">
                <Button variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 