"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, User, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/app/context/AuthContext"
import { Header } from "@/components/Header"
import { toast } from "@/components/ui/use-toast"

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    } else if (user) {
      // 사용자 정보로 폼 초기화
      setFormData({
        name: user.name || "",
        email: user.email || "",
      })
    }
  }, [isLoading, isAuthenticated, router, user])

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // 백엔드 API 호출
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "정보 수정에 실패했습니다.")
      }

      const data = await response.json()

      // AuthContext 업데이트
      updateUser({
        name: formData.name,
        email: formData.email
      })
      
      // 성공 메시지 표시
      toast({
        title: "정보 수정 완료",
        description: "회원 정보가 성공적으로 업데이트되었습니다.",
      })
      
      // 마이페이지로 리다이렉트
      setTimeout(() => {
        router.push("/mypage")
      }, 1000)
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error instanceof Error ? error.message : "정보 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      })
      console.error("정보 수정 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <Link href="/mypage" className="inline-flex items-center text-sm text-gray-500 hover:text-sky-500 transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" />
              마이페이지로 돌아가기
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">내 정보 수정</CardTitle>
                <CardDescription>회원 정보를 수정할 수 있습니다.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4 bg-sky-50 mb-6">
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
                    <div className="space-y-2">
                      <label htmlFor="userId" className="text-sm font-medium text-gray-700">
                        사용자 ID (변경 불가)
                      </label>
                      <Input
                        id="userId"
                        value={user?.id || ""}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        이름 *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        이메일 *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.push("/mypage")}
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-sky-500 hover:bg-sky-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "저장 중..." : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        변경사항 저장
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <footer className="w-full border-t bg-white py-4">
        <div className="container px-4 md:px-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MediGo. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 