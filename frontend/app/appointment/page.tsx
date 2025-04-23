"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Calendar as CalendarIcon,
  Clock, 
  User, 
  Phone, 
  FileText, 
  ChevronRight, 
  Hospital, 
  ChevronLeft,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Header } from "@/components/Header";

// 더미 데이터
const departments = [
  { id: "internal", name: "내과" },
  { id: "surgery", name: "외과" },
  { id: "orthopedics", name: "정형외과" },
  { id: "neurology", name: "신경과" },
  { id: "pediatrics", name: "소아과" },
  { id: "dermatology", name: "피부과" },
  { id: "ophthalmology", name: "안과" },
  { id: "otolaryngology", name: "이비인후과" },
  { id: "urology", name: "비뇨기과" },
  { id: "psychiatry", name: "정신건강의학과" },
];

const doctors = [
  { id: "kim", name: "김의사", department: "internal", specialty: "소화기 질환" },
  { id: "lee", name: "이의사", department: "surgery", specialty: "간담췌 외과" },
  { id: "park", name: "박의사", department: "orthopedics", specialty: "척추 질환" },
  { id: "choi", name: "최의사", department: "neurology", specialty: "뇌졸중, 두통" },
  { id: "jung", name: "정의사", department: "pediatrics", specialty: "소아 알레르기" },
  { id: "yoon", name: "윤의사", department: "dermatology", specialty: "피부 질환" },
  { id: "kang", name: "강의사", department: "ophthalmology", specialty: "백내장, 녹내장" },
  { id: "shin", name: "신의사", department: "otolaryngology", specialty: "이명, 난청" },
];

// 시간대 생성
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    slots.push(`${hour}:00`);
    if (i !== 17) { // 17:30은 제외
      slots.push(`${hour}:30`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function AppointmentPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: undefined as Date | undefined,
    time: "",
    name: "",
    phone: "",
    email: "",
    symptoms: "",
    agreement: false,
  });
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  
  // 단계별 진행 상태
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // 사용자가 로그인한 경우 기본 정보 채우기
  useState(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  });

  // 진료과 선택 시 의사 필터링
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value, doctor: "" }));
    setFilteredDoctors(doctors.filter(doc => doc.department === value));
  };

  // 다음 단계로
  const goToNextStep = () => {
    // 각 단계별 검증
    if (step === 1) {
      if (!formData.department || !formData.doctor || !formData.date || !formData.time) {
        alert("모든 예약 정보를 입력해주세요.");
        return;
      }
    } else if (step === 2) {
      if (!formData.name || !formData.phone || !formData.email) {
        alert("모든 환자 정보를 입력해주세요.");
        return;
      }
      
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phoneRegex.test(formData.phone.replace(/-/g, ""))) {
        alert("올바른 전화번호 형식이 아닙니다.");
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("올바른 이메일 형식이 아닙니다.");
        return;
      }
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // 이전 단계로
  const goToPrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // 예약 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreement) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    
    // 여기서 예약 정보를 서버에 전송하는 로직을 추가할 수 있습니다.
    console.log("예약 정보:", formData);
    
    // 예약 완료 화면으로
    setStep(4);
    window.scrollTo(0, 0);
  };

  // 예약 정보 확인 렌더링
  const renderAppointmentSummary = () => {
    const selectedDoctor = doctors.find(doc => doc.id === formData.doctor);
    const selectedDepartment = departments.find(dept => dept.id === formData.department);
    
    return (
      <div className="space-y-4">
        <div className="bg-sky-50 p-4 rounded-lg">
          <h3 className="font-medium text-sky-800 mb-2">예약 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">진료과:</span>{" "}
              <span className="font-medium">{selectedDepartment?.name}</span>
            </div>
            <div>
              <span className="text-gray-500">담당의:</span>{" "}
              <span className="font-medium">{selectedDoctor?.name} 의사</span>
            </div>
            <div>
              <span className="text-gray-500">예약일:</span>{" "}
              <span className="font-medium">
                {formData.date && format(formData.date, "PPP", { locale: ko })}
              </span>
            </div>
            <div>
              <span className="text-gray-500">예약시간:</span>{" "}
              <span className="font-medium">{formData.time}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-sky-50 p-4 rounded-lg">
          <h3 className="font-medium text-sky-800 mb-2">환자 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">이름:</span>{" "}
              <span className="font-medium">{formData.name}</span>
            </div>
            <div>
              <span className="text-gray-500">연락처:</span>{" "}
              <span className="font-medium">{formData.phone}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500">이메일:</span>{" "}
              <span className="font-medium">{formData.email}</span>
            </div>
          </div>
        </div>
        
        {formData.symptoms && (
          <div className="bg-sky-50 p-4 rounded-lg">
            <h3 className="font-medium text-sky-800 mb-2">증상 및 참고사항</h3>
            <p className="text-sm whitespace-pre-line">{formData.symptoms}</p>
          </div>
        )}
        
        <div className="flex items-center space-x-2 pt-4">
          <input
            type="checkbox"
            id="agreement"
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            checked={formData.agreement}
            onChange={e => setFormData(prev => ({ ...prev, agreement: e.target.checked }))}
          />
          <label htmlFor="agreement" className="text-sm text-gray-700">
            개인정보 수집 및 이용에 동의합니다.
          </label>
        </div>
      </div>
    );
  };

  // 예약 완료 화면
  if (step === 4) {
    const selectedDoctor = doctors.find(doc => doc.id === formData.doctor);
    const selectedDepartment = departments.find(dept => dept.id === formData.department);
    
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto border-sky-100">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-sky-700">예약이 완료되었습니다</CardTitle>
              <CardDescription>
                아래 예약 정보를 확인해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-sky-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">예약번호:</span>{" "}
                    <span className="font-medium">{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">진료과:</span>{" "}
                    <span className="font-medium">{selectedDepartment?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">담당의:</span>{" "}
                    <span className="font-medium">{selectedDoctor?.name} 의사</span>
                  </div>
                  <div>
                    <span className="text-gray-500">예약일:</span>{" "}
                    <span className="font-medium">
                      {formData.date && format(formData.date, "PPP", { locale: ko })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">예약시간:</span>{" "}
                    <span className="font-medium">{formData.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">환자명:</span>{" "}
                    <span className="font-medium">{formData.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600">
                <p>예약 내용은 등록하신 이메일({formData.email})로 발송되었습니다.</p>
                <p>변경 또는 취소는 예약일 하루 전까지 가능합니다.</p>
                <p>병원 방문 시 접수 창구에 예약번호를 말씀해주세요.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button
                className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600"
                onClick={() => router.push("/mypage")}
              >
                마이페이지로 가기
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-sky-200 text-sky-700 hover:bg-sky-50"
                onClick={() => router.push("/")}
              >
                홈으로 돌아가기
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-sky-700 mb-2">진료 예약</h1>
            <p className="text-gray-600">원하시는 진료과와 의사를 선택하고 편리하게 예약하세요.</p>
            
            {/* 진행 상태 표시 */}
            <div className="mt-6">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3].map(stepNum => (
                    <div 
                      key={stepNum}
                      className={`flex items-center justify-center rounded-full w-8 h-8 text-xs font-medium border-2 
                        ${step >= stepNum 
                          ? "bg-sky-500 border-sky-500 text-white" 
                          : "bg-white border-gray-300 text-gray-500"}`}
                    >
                      {stepNum}
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500 transition-all duration-300"></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className={`text-xs font-medium ${step >= 1 ? "text-sky-600" : "text-gray-500"}`}>
                    예약 정보
                  </span>
                  <span className={`text-xs font-medium ${step >= 2 ? "text-sky-600" : "text-gray-500"}`}>
                    환자 정보
                  </span>
                  <span className={`text-xs font-medium ${step >= 3 ? "text-sky-600" : "text-gray-500"}`}>
                    예약 확인
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="border-sky-100">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                {/* 단계 1: 예약 정보 */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="department" className="text-sm font-medium">
                          진료과 선택 <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={formData.department}
                          onValueChange={handleDepartmentChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="진료과를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="doctor" className="text-sm font-medium">
                          의사 선택 <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={formData.doctor}
                          onValueChange={value => setFormData(prev => ({ ...prev, doctor: value }))}
                          disabled={!formData.department}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={formData.department ? "담당의를 선택하세요" : "진료과를 먼저 선택하세요"} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredDoctors.map(doc => (
                              <SelectItem key={doc.id} value={doc.id}>
                                {doc.name} ({doc.specialty})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium">
                          예약 날짜 <span className="text-red-500">*</span>
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date ? (
                                format(formData.date, "PPP", { locale: ko })
                              ) : (
                                <span>날짜를 선택하세요</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.date}
                              onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                              fromDate={new Date()}
                              locale={ko}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="time" className="text-sm font-medium">
                          예약 시간 <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={formData.time}
                          onValueChange={value => setFormData(prev => ({ ...prev, time: value }))}
                          disabled={!formData.date}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={formData.date ? "시간을 선택하세요" : "날짜를 먼저 선택하세요"} />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {formData.doctor && (
                      <div className="mt-6 bg-sky-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-sky-800 mb-2">의사 정보</h3>
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{doctors.find(d => d.id === formData.doctor)?.name} 의사</p>
                            <p className="text-sm text-gray-600">
                              {departments.find(d => d.id === formData.department)?.name} · 
                              {doctors.find(d => d.id === formData.doctor)?.specialty}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              월, 화, 수, 금 오전/오후 진료 · 목 오전 진료
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 단계 2: 환자 정보 */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          이름 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="이름을 입력하세요"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          연락처 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="010-0000-0000"
                          required
                        />
                        <p className="text-xs text-gray-500">예약 확인 및 안내 문자가 발송됩니다.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="이메일을 입력하세요"
                        required
                      />
                      <p className="text-xs text-gray-500">예약 확인 이메일이 발송됩니다.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="symptoms" className="text-sm font-medium">
                        증상 및 참고사항
                      </label>
                      <Textarea
                        id="symptoms"
                        value={formData.symptoms}
                        onChange={e => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                        placeholder="증상이나 참고사항을 자유롭게 입력해주세요."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}
                
                {/* 단계 3: 예약 확인 */}
                {step === 3 && renderAppointmentSummary()}
                
                {/* 단계 이동 버튼 */}
                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-sky-200 text-sky-700 hover:bg-sky-50"
                      onClick={goToPrevStep}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      이전
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-sky-200 text-sky-700 hover:bg-sky-50"
                      onClick={() => router.push("/")}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      홈으로
                    </Button>
                  )}
                  
                  {step < totalSteps ? (
                    <Button
                      type="button"
                      className="bg-sky-500 hover:bg-sky-600"
                      onClick={goToNextStep}
                    >
                      다음
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-sky-500 hover:bg-sky-600"
                    >
                      예약하기
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 