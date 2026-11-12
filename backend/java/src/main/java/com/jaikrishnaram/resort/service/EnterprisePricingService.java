package com.jaikrishnaram.resort.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
public class EnterprisePricingService {

    private static final BigDecimal BASE_WEEKEND_PRICE = new BigDecimal("500000.00");
    private static final BigDecimal GST_RATE = new BigDecimal("0.18"); // 18% GST (9% CGST + 9% SGST)
    private static final BigDecimal SECURITY_DEPOSIT = new BigDecimal("50000.00");

    private static final Map<String, BigDecimal> ADDON_RATES = Map.of(
        "catering", new BigDecimal("75000.00"),
        "drone", new BigDecimal("35000.00"),
        "music", new BigDecimal("40000.00"),
        "golfcarts", new BigDecimal("20000.00")
    );

    public Map<String, Object> generateQuotation(List<String> selectedAddons, String couponCode) {
        BigDecimal addonsTotal = BigDecimal.ZERO;
        if (selectedAddons != null) {
            for (String addon : selectedAddons) {
                if (ADDON_RATES.containsKey(addon)) {
                    addonsTotal = addonsTotal.add(ADDON_RATES.get(addon));
                }
            }
        }

        BigDecimal subtotal = BASE_WEEKEND_PRICE.add(addonsTotal);
        BigDecimal discount = BigDecimal.ZERO;

        if ("MMTHYD2026".equalsIgnoreCase(couponCode)) {
            discount = subtotal.multiply(new BigDecimal("0.10")).min(new BigDecimal("50000.00"));
        } else if ("FARMHOUSEVIP".equalsIgnoreCase(couponCode)) {
            discount = new BigDecimal("25000.00");
        }

        BigDecimal taxable = subtotal.subtract(discount).max(BigDecimal.ZERO);
        BigDecimal cgst = taxable.multiply(new BigDecimal("0.09")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal sgst = taxable.multiply(new BigDecimal("0.09")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalTaxes = cgst.add(sgst);
        BigDecimal grandTotal = taxable.add(totalTaxes).add(SECURITY_DEPOSIT);

        return Map.of(
            "resortName", "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
            "baseAmount", BASE_WEEKEND_PRICE,
            "addonsAmount", addonsTotal,
            "discountAmount", discount,
            "taxableAmount", taxable,
            "cgstAmount", cgst,
            "sgstAmount", sgst,
            "taxesAmount", totalTaxes,
            "securityDeposit", SECURITY_DEPOSIT,
            "grandTotal", grandTotal,
            "currency", "INR"
        );
    }
}

