package com.example.admin_demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableCaching
@EnableScheduling
@SpringBootApplication
public class AdminDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminDemoApplication.class, args);
    }
}
