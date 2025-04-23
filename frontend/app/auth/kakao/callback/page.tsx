"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function KakaoCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

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
                const accessToken = data.access_token;
                console.log("🎟️ access_token:", accessToken);

                // 👉 사용자 정보 요청
                return fetch("https://kapi.kakao.com/v2/user/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            })
            .then((res) => res.json())
            .then((userData) => {
                console.log("👤 사용자 정보:", userData);

                // 👉 저장 (예: 로컬스토리지)
                localStorage.setItem("kakao_user", JSON.stringify(userData));
                router.push("/"); // 홈으로 리디렉트
            })
            .catch((err) => {
                console.error("❌ 로그인 실패", err);
                router.push("/auth/login");
            });
    }, []);

    return <div className="p-4 text-center">로그인 처리 중입니다...</div>;
}
