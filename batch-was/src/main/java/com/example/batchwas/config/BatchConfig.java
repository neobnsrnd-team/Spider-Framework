package com.example.batchwas.config;

import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.configuration.support.JobRegistryBeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Batch 공통 설정.
 *
 * <p>JobRegistryBeanPostProcessor: 컨텍스트에 등록된 모든 {@link org.springframework.batch.core.Job} Bean을
 * JobRegistry에 자동 등록한다. BatchExecuteService에서 batchAppFileName으로 Job을 동적으로 조회할 때 사용.</p>
 */
@Configuration
public class BatchConfig {

    /**
     * 모든 Job Bean을 JobRegistry에 자동 등록하는 BeanPostProcessor.
     * 애플리케이션 기동 시 File2DbJob, Db2DbJob, Db2ForeignJob이 등록된다.
     */
    @Bean
    public JobRegistryBeanPostProcessor jobRegistryBeanPostProcessor(JobRegistry jobRegistry) {
        JobRegistryBeanPostProcessor processor = new JobRegistryBeanPostProcessor();
        processor.setJobRegistry(jobRegistry);
        return processor;
    }
}
