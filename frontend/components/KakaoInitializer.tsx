'use client'

import { useEffect } from "react";

export default function KakaoInitializer() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.async = true;
        script.onload = () => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
                console.log("✅ Kakao SDK Initialized");
            }
        };
        document.head.appendChild(script);
    }, []);

    return null;
}
