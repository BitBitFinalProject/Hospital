// types/kakao.d.ts

interface KakaoAuth {
    authorize: (options: { redirectUri: string }) => void;
}

interface Kakao {
    Auth: KakaoAuth;
    init: (key: string) => void;
    isInitialized: () => boolean;
}

interface Window {
    Kakao: Kakao;
}
