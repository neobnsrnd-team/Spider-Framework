package com.example.biztransfer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 이체AP(biz-transfer) 메인 진입점.
 *
 * <p>SpiderTcpServer를 포트 19200에서 기동하고,
 * TRANSFER_* 커맨드를 수신하여 mock-core(포트 19300)로 중계한다.</p>
 */
@SpringBootApplication
public class BizTransferApplication {

    public static void main(String[] args) {
        SpringApplication.run(BizTransferApplication.class, args);
    }
}
