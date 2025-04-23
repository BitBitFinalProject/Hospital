"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login, logout, isAuthenticated } = useAuth();
    const [nickname, setNickname] = useState("");
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "");
            console.log("✅ Kakao SDK Initialized");
        }

        const kakaoUser = localStorage.getItem("kakao_user");
        if (kakaoUser) {
            const parsed = JSON.parse(kakaoUser);
            setNickname(parsed.kakao_account?.profile?.nickname || "카카오 유저");
        }
    }, []);

    const handleKakaoLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI as string
        });
    };

    const handleMemberLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // 간단한 로그인 시뮬레이션
        setTimeout(() => {
            // 사용자 정보를 AuthContext에 저장
            login("dummy-token", {
                id: "user123",
                email: email,
                name: email.split("@")[0],
                role: "PATIENT"
            });
            
            setNickname(email);
            setShowMemberForm(false);
            setIsLoading(false);
            
            // 홈 화면으로 이동
            router.push("/");
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-12">
            <Card className="w-full max-w-md mx-auto border-sky-100">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-sky-500 transition-colors">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            홈으로 돌아가기
                        </Link>
                        {isAuthenticated && (
                            <Button 
                                onClick={logout} 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-500 hover:text-red-500"
                            >
                                <LogOut className="mr-1 h-4 w-4" />
                                로그아웃
                            </Button>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-sky-700">
                        {isAuthenticated ? `환영합니다` : "로그인"}
                    </CardTitle>
                    <CardDescription className="text-center text-gray-500">
                        {isAuthenticated 
                            ? "병원 서비스를 이용하실 수 있습니다"
                            : "계정에 로그인하여 서비스를 이용하세요"}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    {isAuthenticated ? (
                        <div className="flex flex-col items-center space-y-4">
                            <img 
                                src="https://api.dicebear.com/6.x/fun-emoji/svg?seed=hospital"
                                alt="Profile" 
                                className="w-24 h-24 rounded-full bg-sky-100 p-2" 
                            />
                            <div className="flex gap-4">
                                <Button 
                                    onClick={() => router.push("/mypage")}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    마이페이지
                                </Button>
                                <Button 
                                    onClick={() => router.push("/")}
                                    className="bg-sky-500 hover:bg-sky-600"
                                >
                                    홈으로 가기
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleMemberLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        이메일
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full bg-sky-500 hover:bg-sky-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "로그인 중..." : "로그인"}
                                </Button>
                            </form>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-card px-2 text-gray-500">소셜 로그인</span>
                                </div>
                            </div>
                            
                            <Button
                                onClick={handleKakaoLogin}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                            >
                                카카오톡으로 로그인
                            </Button>
                        </>
                    )}
                </CardContent>
                
                <CardFooter className="flex justify-center">
                    {!isAuthenticated && (
                        <div className="text-center text-sm text-gray-500">
                            계정이 없으신가요?{" "}
                            <Link href="/auth/register" className="text-sky-500 hover:text-sky-600 font-medium">
                                회원가입
                            </Link>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
