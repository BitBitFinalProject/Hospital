"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Search, MapPin, Phone, ChevronRight } from "lucide-react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// 병원 타입 정의
type Department = {
  id: number
  name: string
}

type Hospital = {
  id: number
  name: string
  address: string
  phone: string
  departments: Department[]
}

type HospitalListResponse = {
  hospitals: Hospital[]
  totalCount: number
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    name: "",
    address: "",
    departmentName: ""
  })

  // 병원 목록 가져오기
  const fetchHospitals = async (params = {}) => {
    try {
      setIsLoading(true)
      
      // 쿼리 파라미터 구성
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string)
      })
      
      const response = await fetch(`/api/hospitals?${queryParams.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "병원 목록을 불러오는데 실패했습니다.")
      }
      
      const data: HospitalListResponse = await response.json()
      setHospitals(data.hospitals || [])
    } catch (error) {
      toast({
        title: "데이터 로딩 오류",
        description: error instanceof Error ? error.message : "병원 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 병원 목록 가져오기
  useEffect(() => {
    fetchHospitals()
  }, [])

  // 검색 파라미터 변경 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 검색 폼 제출 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchHospitals(searchParams)
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
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-sky-700 mb-2">병원 목록</h1>
            <p className="text-gray-500">총 {hospitals.length}개의 병원이 등록되어 있습니다.</p>
          </div>

          {/* 검색 필터 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>병원 검색</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">병원명</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="병원 이름 검색"
                    value={searchParams.name}
                    onChange={handleSearchInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">지역</label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="지역명 검색"
                    value={searchParams.address}
                    onChange={handleSearchInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="departmentName" className="text-sm font-medium">진료과목</label>
                  <Input
                    id="departmentName"
                    name="departmentName"
                    placeholder="진료과목 검색"
                    value={searchParams.departmentName}
                    onChange={handleSearchInputChange}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                    <Search className="mr-2 h-4 w-4" />
                    검색
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 병원 목록 */}
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">병원 정보를 불러오는 중입니다...</p>
            </div>
          ) : hospitals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-sky-700">{hospital.name}</h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <p className="text-gray-600">{hospital.address}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <p className="text-gray-600">{hospital.phone}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">진료과목</h3>
                      <div className="flex flex-wrap gap-2">
                        {hospital.departments.map((dept) => (
                          <span 
                            key={dept.id} 
                            className="inline-block bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full"
                          >
                            {dept.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-sky-200 text-sky-700 hover:bg-sky-50"
                      >
                        상세 정보
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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