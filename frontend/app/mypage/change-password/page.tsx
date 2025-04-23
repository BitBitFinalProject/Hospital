"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Lock, Shield, EyeOff, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/app/context/AuthContext"
import { Header } from "@/components/Header"
import { toast } from "@/components/ui/use-toast"

export default function ChangePasswordPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    // 최소 8자 이상, 영문, 숫자, 특수문자 조합
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return passwordRegex.test(password)
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive"
      })
      return
    }

    if (!validatePassword(formData.newPassword)) {
      toast({
        title: "비밀번호 형식 오류",
        description: "비밀번호는 8자 이상의 영문, 숫자, 특수문자 조합이어야 합니다.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // 이 부분은 실제 서버 API가 구현된 후에 연결해야 합니다.
      // 현재는 가상의 API 호출로 구현합니다.
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })

      // 백엔드 API가 없으므로 성공한 것처럼 처리합니다.
      // 실제 구현 시에는 아래 주석을 해제하고 사용합니다.
      /*
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "비밀번호 변경에 실패했습니다.")
      }
      */

      // 성공 메시지 표시
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      })
      
      // 마이페이지로 리다이렉트
      setTimeout(() => {
        router.push("/mypage")
      }, 1000)
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error instanceof Error ? error.message : "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "destructive"
      })
      console.error("비밀번호 변경 오류:", error)
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
                <CardTitle className="text-xl font-bold">비밀번호 변경</CardTitle>
                <CardDescription>
                  안전한 계정 관리를 위해 정기적으로 비밀번호를 변경해주세요.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm mb-4">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>안전한 비밀번호 가이드라인</strong>
                        <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                          <li>최소 8자 이상이어야 합니다</li>
                          <li>영문, 숫자, 특수문자를 조합해야 합니다</li>
                          <li>이전에 사용했던 비밀번호는 피해주세요</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                        현재 비밀번호 *
                      </label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                        새 비밀번호 *
                      </label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        새 비밀번호 확인 *
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
                      )}
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
                    {isSubmitting ? "처리 중..." : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        비밀번호 변경
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