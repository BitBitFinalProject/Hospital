import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Phone, MapPin, ChevronRight, Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/Header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-sky-700">
                    건강한 삶을 위한
                    <br />
                    최고의 의료 서비스
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    MediGo와 함께 쉽고 빠르게 진료 예약을 하고 최고의 의료진에게 진료받으세요.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-sky-500 hover:bg-sky-600">
                    지금 예약하기
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                    협력 병원 조회
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <Image
                  src="/hospital-image.jpg"
                  alt="병원 이미지"
                  width={580}
                  height={480}
                  className="w-full aspect-[4/3] object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-sky-700">
                  간편한 진료 예약
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  원하는 진료과와 의사를 선택하여 빠르게 예약하세요.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-8">
              <Card className="border-sky-100 shadow-md">
                <CardContent className="p-6">
                  <Tabs defaultValue="department" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="department"
                        className="data-[state=active]:bg-sky-500 data-[state=active]:text-white"
                      >
                        진료과 예약
                      </TabsTrigger>
                      <TabsTrigger
                        value="doctor"
                        className="data-[state=active]:bg-sky-500 data-[state=active]:text-white"
                      >
                        병원 예약
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="department" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="department" className="text-sm font-medium">
                            진료과 선택
                          </label>
                          <select
                            id="department"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">진료과를 선택하세요</option>
                            <option value="internal">내과</option>
                            <option value="surgery">외과</option>
                            <option value="orthopedics">정형외과</option>
                            <option value="neurology">신경과</option>
                            <option value="pediatrics">소아과</option>
                            <option value="dermatology">피부과</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="date" className="text-sm font-medium">
                            예약 날짜
                          </label>
                          <div className="relative">
                            <Input
                              id="date"
                              type="date"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="time" className="text-sm font-medium">
                            예약 시간
                          </label>
                          <div className="relative">
                            <Input
                              id="time"
                              type="time"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">
                            연락처
                          </label>
                          <div className="relative">
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="010-0000-0000"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-sky-500 hover:bg-sky-600 mt-2">예약하기</Button>
                    </TabsContent>
                    <TabsContent value="doctor" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="doctor" className="text-sm font-medium">
                            병원 선택
                          </label>
                          <select
                            id="doctor"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">의료진을 선택하세요</option>
                            <option value="kim">김의사 (내과)</option>
                            <option value="lee">이의사 (외과)</option>
                            <option value="park">박의사 (정형외과)</option>
                            <option value="choi">최의사 (신경과)</option>
                            <option value="jung">정의사 (소아과)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="doctor-date" className="text-sm font-medium">
                            예약 날짜
                          </label>
                          <div className="relative">
                            <Input
                              id="doctor-date"
                              type="date"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="doctor-time" className="text-sm font-medium">
                            예약 시간
                          </label>
                          <div className="relative">
                            <Input
                              id="doctor-time"
                              type="time"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="doctor-phone" className="text-sm font-medium">
                            연락처
                          </label>
                          <div className="relative">
                            <Input
                              id="doctor-phone"
                              type="tel"
                              placeholder="010-0000-0000"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-sky-500 hover:bg-sky-600 mt-2">예약하기</Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-sky-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-sky-700">
                  주요 진료과목
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  MediGo에서 제공하는 다양한 진료과목을 확인하세요.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[
                { name: "내과", desc: "소화기, 호흡기, 순환기 등 내부 장기의 질환을 진단하고 치료합니다." },
                { name: "외과", desc: "수술적 치료가 필요한 다양한 질환을 진단하고 치료합니다." },
                { name: "정형외과", desc: "뼈, 관절, 근육 등 운동기관의 질환을 진단하고 치료합니다." },
                { name: "신경과", desc: "뇌, 척수, 말초신경 등 신경계통의 질환을 진단하고 치료합니다." },
                { name: "소아과", desc: "영유아부터 청소년까지 성장 발달과 질병을 관리합니다." },
                { name: "피부과", desc: "피부 및 피부 부속기의 질환을 진단하고 치료합니다." },
              ].map((dept, index) => (
                <Card key={index} className="border-sky-100 hover:border-sky-300 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-sky-500">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-sky-700">{dept.name}</h3>
                    <p className="text-gray-500">{dept.desc}</p>
                    <Button variant="link" className="mt-4 text-sky-500">
                      자세히 보기
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-sky-700">
                  우수 의료진 소개
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  MediGo의 전문 의료진을 소개합니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[
                { name: "김의사", dept: "내과", exp: "경력 15년" },
                { name: "이의사", dept: "외과", exp: "경력 12년" },
                { name: "박의사", dept: "정형외과", exp: "경력 10년" },
                { name: "최의사", dept: "신경과", exp: "경력 8년" },
              ].map((doctor, index) => (
                <Card key={index} className="border-sky-100 hover:border-sky-300 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                      <Image
                        src={`/doctor-${index + 1}.jpg`}
                        alt={`${doctor.name} 의사 프로필`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-sky-700">{doctor.name}</h3>
                    <p className="text-gray-500 mb-1">{doctor.dept}</p>
                    <p className="text-sm text-gray-400">{doctor.exp}</p>
                    <Button variant="outline" className="mt-4 border-sky-200 text-sky-700 hover:bg-sky-50">
                      상세 프로필
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                의료진 더 보기
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-sky-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-sky-700">MediGo 소개</h2>
                  <p className="text-gray-500 md:text-xl">
                  환자 맞춤형 검색부터 간편 예약까지,<br/>
                  믿을 수 있는 의료 서비스가 언제나 곁에 있습니다.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-sky-100 p-1">
                      <ChevronRight className="h-4 w-4 text-sky-500" />
                    </div>
                    <p>신뢰와 편리함을 한번에</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-sky-100 p-1">
                      <ChevronRight className="h-4 w-4 text-sky-500" />
                    </div>
                    <p>빠르고 정확한 의료 연결</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-sky-100 p-1">
                      <ChevronRight className="h-4 w-4 text-sky-500" />
                    </div>
                    <p>환자 우선, 의료도 스마트하게</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-sky-100 p-1">
                      <ChevronRight className="h-4 w-4 text-sky-500" />
                    </div>
                    <p>의료 서비스의 새로운 기준</p>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-sky-500 hover:bg-sky-600">서비스 둘러보기</Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <Image
                  src="/hospital-interior.jpg"
                  alt="병원 내부"
                  width={580}
                  height={480}
                  className="w-full aspect-[4/3] object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-white">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="MediGo 로고" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold text-sky-500">MediGo</span>
            </Link>
            <nav className="flex flex-wrap gap-4 md:gap-6">
              <Link href="#" className="text-sm hover:underline underline-offset-4">
                이용약관
              </Link>
              <Link href="#" className="text-sm font-bold hover:underline underline-offset-4">
                개인정보처리방침
              </Link>
              <Link href="#" className="text-sm hover:underline underline-offset-4">
                비급여 안내
              </Link>
              <Link href="#" className="text-sm hover:underline underline-offset-4">
                오시는 길
              </Link>
            </nav>
          </div>
          <div className="grid gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <p>서울특별시 강남구 테헤란로 123 MediGo빌딩</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <p>대표전화: 02-123-4567</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <p>상담시간: 평일 09:00-18:00 | 토요일 09:00-13:00 </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} MediGo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
