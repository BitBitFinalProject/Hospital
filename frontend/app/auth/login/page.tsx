"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState("");
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
            console.log("✅ Kakao SDK Initialized");
        }

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
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI as string
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("kakao_user");
        localStorage.removeItem("member_user");
        setIsLoggedIn(false);
        setNickname("");
        setShowMemberForm(false);
        router.refresh();
    };

    const handleMemberLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("member_user", JSON.stringify({ email }));
        setIsLoggedIn(true);
        setNickname(email);
        setShowMemberForm(false);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            {isLoggedIn ? (
                <>
                    <h2 className="text-xl font-semibold mb-4">{nickname} 님 환영합니다 😊</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push("/mypage")}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            마이페이지
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            로그아웃
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">로그인</h1>

                    <button
                        onClick={handleKakaoLogin}
                        className="mb-2 px-4 py-2 bg-yellow-400 rounded text-black w-64"
                    >
                        🟡 카카오톡으로 로그인
                    </button>

                    <button
                        onClick={() => setShowMemberForm(!showMemberForm)}
                        className="px-4 py-2 bg-sky-500 rounded text-white w-64"
                    >
                        🔵 회원으로 로그인
                    </button>

                    {showMemberForm && (
                        <form
                            onSubmit={handleMemberLogin}
                            className="mt-4 p-4 border rounded shadow w-64"
                        >
                            <input
                                type="email"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full mb-2 px-3 py-2 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full mb-4 px-3 py-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600"
                            >
                                로그인
                            </button>
                        </form>
                    )}
                </>
            )}
        </main>
    );
}
