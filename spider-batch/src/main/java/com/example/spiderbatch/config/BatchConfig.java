package com.example.spiderbatch.config;

import org.springframework.context.annotation.Configuration;

/**
 * Spring Batch 공통 설정.
 *
 * <p>Spring Batch 5.x는 JobRegistrySmartInitializingSingleton이 자동으로
 * 모든 Job Bean을 JobRegistry에 등록한다.
 * JobRegistryBeanPostProcessor를 추가하면 이중 등록으로 DuplicateJobException이 발생하므로 제거.</p>
 */
@Configuration
public class BatchConfig {
}
