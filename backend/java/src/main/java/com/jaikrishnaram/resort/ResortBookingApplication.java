package com.jaikrishnaram.resort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ResortBookingApplication {
    public static void main(String[] args) {
        SpringApplication.run(ResortBookingApplication.class, args);
        System.out.println("🏰 Jai Krishna Ram Resort Enterprise Service Started on port 8082");
    }
}

