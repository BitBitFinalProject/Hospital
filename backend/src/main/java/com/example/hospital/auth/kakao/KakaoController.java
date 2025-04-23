/*
package com.example.hospital.auth.kakao;


import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;

@RestController
@RequestMapping("/auth/kakao")
public class KakaoController {

    private final KakaoService kakaoService;

    public KakaoController(KakaoService kakaoService) {
        this.kakaoService = kakaoService;
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> kakaoCallback(@RequestParam String code) throws Exception {
        kakaoService.getUserInfo(code); // 유저 정보 조회

        URI redirectUri = URI.create("http://localhost:3000");
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirectUri); // ✅ 리디렉션

        return ResponseEntity.status(302).headers(headers).build();
    }
}
*/
