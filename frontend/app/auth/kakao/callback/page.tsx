"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function KakaoCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) return;

        console.log("✅ 인가코드 수신:", code);

        // 👉 직접 토큰 요청 (REST API 호출)
        fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!, // REST API 키
                redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!, // callback URI
                code: code,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // 토큰 변수 저장
                const token = data.access_token;
                console.log("🎟️ access_token:", token);

                // 👉 사용자 정보 요청
                return fetch("https://kapi.kakao.com/v2/user/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(res => res.json())
                .then(userData => {
                    console.log("👤 사용자 정보:", userData);

                    // 로컬 스토리지에 카카오 유저 정보 저장 (기존 코드 유지)
                    localStorage.setItem("kakao_user", JSON.stringify(userData));
                    
                    // AuthContext에 사용자 정보 저장 - token 변수를 직접 전달
                    login(token, {
                        id: userData.id.toString(),
                        email: userData.kakao_account?.email || `kakao_${userData.id}@kakao.com`,
                        name: userData.kakao_account?.profile?.nickname || "카카오 사용자",
                        role: "PATIENT"
                    });
                    
                    router.push("/"); // 홈으로 리디렉트
                });
            })
            .catch((err) => {
                console.error("❌ 로그인 실패", err);
                router.push("/auth/login");
            });
    }, [searchParams, router, login]);

    return <div className="p-4 text-center">로그인 처리 중입니다...</div>;
}
