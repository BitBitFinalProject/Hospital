/*
package com.example.hospital.auth.kakao;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class KakaoService {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final WebClient webClient = WebClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public KakaoUserInfo getUserInfo(String code) throws Exception {
        // 1. 인가코드로 access token 요청
        String tokenResponse = webClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .bodyValue("grant_type=authorization_code" +
                        "&client_id=" + clientId +
                        "&redirect_uri=" + redirectUri +
                        "&code=" + code)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JsonNode tokenJson = objectMapper.readTree(tokenResponse);
        String accessToken = tokenJson.get("access_token").asText();

        // 2. access token으로 사용자 정보 요청
        String userInfoResponse = webClient.get()
                .uri("https://kapi.kakao.com/v2/user/me")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JsonNode userJson = objectMapper.readTree(userInfoResponse);
        Long id = userJson.get("id").asLong();
        JsonNode kakaoAccount = userJson.get("kakao_account");
        String email = kakaoAccount.get("email").asText();
        String nickname = kakaoAccount.get("profile").get("nickname").asText();
        String profileImage = kakaoAccount.get("profile").get("profile_image_url").asText();

        return new KakaoUserInfo(id, email, nickname, profileImage);
    }
}
*/
