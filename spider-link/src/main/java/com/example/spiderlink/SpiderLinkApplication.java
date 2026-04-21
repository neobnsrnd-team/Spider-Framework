package com.example.spiderlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @file SpiderLinkApplication.java
 * @description Spider link 연계엔진 진입점.
 *
 * <p>Admin으로부터 TCP 커맨드(포트 9996)를 수신하여
 * demo/backend(포트 9997)로 프록시한다.</p>
 *
 * <p>통신 흐름: Admin(8080) → spider-link(9996) → demo/backend(9997)</p>
 */
@SpringBootApplication
public class SpiderLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpiderLinkApplication.class, args);
    }
}
