"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, User, Calendar, FileText, Settings, LockKeyhole } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { Header } from "@/components/Header"

export default function MyPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!isAuthenticated) {
    return null // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-10 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-sky-500 transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {/* 사이드바 메뉴 */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-bold">마이페이지</CardTitle>
                <CardDescription>개인 정보 및 예약 관리</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    내 정보
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    예약 내역
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    진료 내역
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    계정 설정
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    비밀번호 변경
                  </Button>
                </nav>
              </CardContent>
            </Card>

            {/* 메인 내용 */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl font-bold">내 정보</CardTitle>
                <CardDescription>회원 정보를 확인하고 관리할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4 bg-sky-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-sky-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user?.name}</h3>
                      <p className="text-gray-500">{user?.role === "PATIENT" ? "환자" : "관리자"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <h4 className="font-medium text-sm text-gray-500">사용자 ID</h4>
                    <p>{user?.id}</p>
                  </div>
                  <div className="grid gap-2">
                    <h4 className="font-medium text-sm text-gray-500">이메일</h4>
                    <p>{user?.email}</p>
                  </div>
                  <div className="grid gap-2">
                    <h4 className="font-medium text-sm text-gray-500">이름</h4>
                    <p>{user?.name}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-sky-500 hover:bg-sky-600">정보 수정</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="w-full border-t bg-white py-4">
        <div className="container px-4 md:px-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MediGo 병원. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 