package com.example.spiderbatch;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @file SpiderBatchApplication.java
 * @description Spring Batch WAS 메인 애플리케이션.
 *              Admin 콘솔에서 POST /api/batch/execute 요청을 수신하여
 *              Spring Batch Job을 실행하고 FWK_BATCH_HIS에 이력을 직접 기록한다.
 */
@SpringBootApplication
@MapperScan("com.example.spiderbatch.domain.batch.mapper")
public class SpiderBatchApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpiderBatchApplication.class, args);
    }
}
