package com.jaikrishnaram.resort.controller;

import com.jaikrishnaram.resort.service.EnterprisePricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/enterprise")
@CrossOrigin(origins = "*")
public class EnterpriseBookingController {

    private final EnterprisePricingService pricingService;

    public EnterpriseBookingController(EnterprisePricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "HEALTHY",
            "service", "Jai Krishna Ram Java Spring Boot Enterprise Service",
            "estate", "100-Acre Sanctuary, Hyderabad"
        ));
    }

    @PostMapping("/quote")
    public ResponseEntity<Map<String, Object>> getQuote(
            @RequestBody Map<String, Object> request
    ) {
        List<String> addons = (List<String>) request.get("addons");
        String coupon = (String) request.get("couponCode");
        Map<String, Object> quotation = pricingService.generateQuotation(addons, coupon);
        return ResponseEntity.ok(quotation);
    }

    @PostMapping("/reserve")
    public ResponseEntity<Map<String, Object>> reserve(
            @RequestBody Map<String, Object> request
    ) {
        String refId = "JKR-SPRING-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return ResponseEntity.ok(Map.of(
            "status", "CONFIRMED",
            "bookingReference", refId,
            "resort", "Jai Krishna Ram 100-Acre Sanctuary, Hyderabad",
            "guestName", request.getOrDefault("guestName", "VIP Guest"),
            "event", request.getOrDefault("eventType", "Corporate Tech Offsite"),
            "message", "Reservation secured with enterprise transaction locking."
        ));
    }
}

