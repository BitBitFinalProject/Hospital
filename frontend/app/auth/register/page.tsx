"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT", // 기본 역할을 환자로 설정
    terms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }))
  }
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 유효성 검사
    if (!formData.id || !formData.name || !formData.email || !formData.password) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive"
      })
      return
    }

    if (!formData.terms) {
      toast({
        title: "약관 동의 필요",
        description: "이용약관 및 개인정보 처리방침에 동의해주세요.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      
      // 백엔드 API 호출
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.id,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role // 선택된 역할 전송
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "회원가입에 실패했습니다.")
      }

      // 성공 처리
      toast({
        title: "회원가입 성공",
        description: "로그인 페이지로 이동합니다.",
      })
      
      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push("/auth/login")
      }, 1000)
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.",
        variant: "destructive"
      })
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
          <CardTitle className="text-2xl font-bold text-center text-sky-700">회원가입</CardTitle>
          <CardDescription className="text-center text-gray-500">
            아래 정보를 입력하여 계정을 생성하세요
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="id" className="text-sm font-medium">
                아이디
              </label>
              <Input
                id="id"
                placeholder="사용할 아이디 입력"
                required
                className="w-full"
                value={formData.id}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                이름
              </label>
              <Input
                id="name"
                placeholder="이름 입력"
                required
                className="w-full"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
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
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                required
                className="w-full"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                8자 이상, 영문/숫자/특수문자 조합으로 입력해주세요
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                비밀번호 확인
              </label>
              <Input
                id="confirmPassword"
                type="password"
                required
                className="w-full"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            {/* 역할 선택 옵션 추가 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                계정 유형
              </label>
              <RadioGroup 
                value={formData.role} 
                onValueChange={handleRoleChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PATIENT" id="patient" />
                  <Label htmlFor="patient" className="font-normal">일반 회원 (환자)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ADMIN" id="admin" />
                  <Label htmlFor="admin" className="font-normal">관리자</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-gray-500">
                {formData.role === "ADMIN" 
                  ? "관리자 계정은 추가 승인이 필요할 수 있습니다."
                  : "환자 계정으로 진료 예약 및 조회가 가능합니다."}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms" className="text-sm text-gray-500">
                <span>이용약관 및 개인정보 처리방침에 동의합니다</span>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-sky-500 hover:bg-sky-600"
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "회원가입"}
            </Button>
            <div className="text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-sky-500 hover:text-sky-600 font-medium">
                로그인
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 