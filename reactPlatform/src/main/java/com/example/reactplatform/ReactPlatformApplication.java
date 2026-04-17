package com.example.reactplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * @file ReactPlatformApplication.java
 * @description React 코드 생성·결재 관리 서버 진입점.
 *     사용자 관리, 역할 관리, React 코드 생성, 승인 워크플로우 기능을 제공한다.
 */
@EnableCaching
@SpringBootApplication
public class ReactPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReactPlatformApplication.class, args);
    }
}
