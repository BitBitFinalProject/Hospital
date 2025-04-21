"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
            console.log("✅ Kakao SDK Initialized");
        }

        // 로그인 상태 확인
        const kakaoUser = localStorage.getItem("kakao_user");
        const memberUser = localStorage.getItem("member_user");

        if (kakaoUser) {
            const parsed = JSON.parse(kakaoUser);
            setNickname(parsed.kakao_account?.profile?.nickname || "카카오 유저");
            setIsLoggedIn(true);
        } else if (memberUser) {
            const parsed = JSON.parse(memberUser);
            setNickname(parsed.email);
            setIsLoggedIn(true);
        }
    }, []);

    const handleKakaoLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        });
    };

    const goToMemberLogin = () => {
        router.push("/auth/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("kakao_user");
        localStorage.removeItem("member_user");
        setIsLoggedIn(false);
        setNickname("");
        router.refresh(); // 새로고침
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            {isLoggedIn ? (
                <>
                    <h2 className="text-xl font-semibold mb-4">{nickname} 님 환영합니다 😊</h2>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold">로그인</h1>

                    <button
                        onClick={handleKakaoLogin}
                        className="mt-4 px-4 py-2 bg-yellow-400 rounded text-black w-64"
                    >
                        🟡 카카오톡으로 로그인
                    </button>

                    <button
                        onClick={goToMemberLogin}
                        className="mt-2 px-4 py-2 bg-sky-500 rounded text-white w-64"
                    >
                        🔵 회원으로 로그인
                    </button>
                </>
            )}
        </main>
    );
}
