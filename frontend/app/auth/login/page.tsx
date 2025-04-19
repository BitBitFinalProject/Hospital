"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 유효성 검사
    if (!formData.email || !formData.password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      
      // 백엔드 API 호출
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "로그인에 실패했습니다.")
      }

      // 응답 데이터 받기
      const data = await response.json()
      
      // 응답 구조 확인 및 디버깅
      console.log("로그인 응답 데이터:", data);
      
      // 인증 컨텍스트 업데이트
      // 백엔드 응답 구조에 맞게 수정
      if (data.accessToken) {
        // JwtResponse 응답 구조 처리 (accessToken, id, email, roles 등)
        login(data.accessToken, {
          id: data.id || "",
          email: data.email || "",
          name: data.username || data.name || "",
          role: Array.isArray(data.roles) ? data.roles[0] : (data.role || "PATIENT")
        });
      } else if (data.token) {
        // 다른 응답 구조 처리
        const user = data.user || {};
        login(data.token, {
          id: user.id || "",
          email: user.email || "",
          name: user.name || "",
          role: user.role || "PATIENT"
        });
      } else {
        throw new Error("알 수 없는 응답 형식입니다.");
      }

      // 성공 처리
      toast({
        title: "로그인 성공",
        description: "메인 페이지로 이동합니다.",
      })
      
      // 메인 페이지로 리다이렉트
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      toast({
        title: "로그인 오류",
        description: error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.",
        variant: "destructive"
      })
      console.error("로그인 오류:", error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md mx-auto border-sky-100">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-sky-500 transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-sky-700">로그인</CardTitle>
          <CardDescription className="text-center text-gray-500">
            계정 정보를 입력하여 로그인하세요
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                required
                className="w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  비밀번호
                </label>
                <Link href="#" className="text-xs text-sky-500 hover:text-sky-600">
                  비밀번호 찾기
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="w-full"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember" className="text-sm text-gray-500">
                로그인 상태 유지
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-sky-500 hover:bg-sky-600"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
            <div className="text-center text-sm text-gray-500">
              계정이 없으신가요?{" "}
              <Link href="/auth/register" className="text-sky-500 hover:text-sky-600 font-medium">
                회원가입
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 