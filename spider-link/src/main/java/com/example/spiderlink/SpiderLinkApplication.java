package com.example.spiderlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * spider-link 연계엔진 실행 진입점.
 *
 * <p>demo/backend 전문 처리 TCP 서버(port 9995)를 내장하여 기동한다.
 * demo/backend가 Spring Boot으로 전환되면 이 standalone 프로세스는 제거 예정.</p>
 */
@SpringBootApplication
public class SpiderLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpiderLinkApplication.class, args);
    }
}
