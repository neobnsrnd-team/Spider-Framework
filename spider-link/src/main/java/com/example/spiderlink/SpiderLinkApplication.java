package com.example.spiderlink;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spider link 연계엔진 진입점.
 *
 * <p>통신 흐름:</p>
 * <ul>
 *   <li>Admin(8080) → spider-link(9996) → demo/backend(9997) : 관리 명령 프록시</li>
 *   <li>demo/backend → spider-link(9999) → Oracle DB : Demo 전문 처리</li>
 * </ul>
 */
@SpringBootApplication
@MapperScan("com.example.spiderlink.domain")
public class SpiderLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpiderLinkApplication.class, args);
    }
}
