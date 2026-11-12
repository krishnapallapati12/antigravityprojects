"""
MakeMyTrip Hyderabad Style Dynamic Pricing & Tax Calculation Engine
Calculates:
- Base Weekend Lease Price (Default: ₹5,00,000 for 100-acre buyout)
- Selected VIP Add-ons (Catering ₹75k, Drone ₹35k, Music ₹40k, Golf Carts ₹20k)
- Promotional Discount / Coupon Code Validation (e.g. MMTHYD2026, FARMHOUSEVIP)
- Indian GST Luxury Hospitality Tax (18% = 9% CGST + 9% SGST)
- Fully Refundable Security Deposit (₹50,000)
"""
from typing import List, Dict, Optional
from datetime import date, timedelta

ADDONS_PRICING: Dict[str, Dict] = {
    "addon-catering": {"name": "Farm-to-Table Royal Banquet", "price": 75000.0},
    "catering": {"name": "Farm-to-Table Royal Banquet", "price": 75000.0},
    "addon-drone": {"name": "Cinematic 4K Drone Photography", "price": 35000.0},
    "drone": {"name": "Cinematic 4K Drone Photography", "price": 35000.0},
    "addon-music": {"name": "Live Acoustic & Sufi Gazebo Performance", "price": 40000.0},
    "music": {"name": "Live Acoustic & Sufi Gazebo Performance", "price": 40000.0},
    "addon-golfcarts": {"name": "Fleet of 4 VIP Electric Golf Carts", "price": 20000.0},
    "golfcarts": {"name": "Fleet of 4 VIP Electric Golf Carts", "price": 20000.0}
}

VALID_COUPONS: Dict[str, Dict] = {
    "MMTHYD2026": {"type": "PERCENTAGE", "value": 10.0, "max": 50000.0, "title": "MakeMyTrip Hyderabad 10% Discount"},
    "FARMHOUSEVIP": {"type": "FLAT", "value": 25000.0, "max": 25000.0, "title": "VIP Sanctuary Flat ₹25,000 Off"},
    "HITEC100": {"type": "PERCENTAGE", "value": 8.0, "max": 40000.0, "title": "HITEC City CXO Forum 8% Off"}
}

def calculate_quote(
    base_price: float = 500000.0,
    guest_count: int = 15,
    selected_addons: Optional[List[str]] = None,
    coupon_code: Optional[str] = None
) -> Dict:
    addons_total = 0.0
    if selected_addons:
        for addon_id in selected_addons:
            if addon_id in ADDONS_PRICING:
                addons_total += ADDONS_PRICING[addon_id]["price"]

    subtotal = base_price + addons_total

    discount = 0.0
    coupon_title = None
    if coupon_code:
        code_upper = coupon_code.strip().upper()
        if code_upper in VALID_COUPONS:
            coupon = VALID_COUPONS[code_upper]
            coupon_title = coupon["title"]
            if coupon["type"] == "PERCENTAGE":
                calc_disc = (subtotal * coupon["value"]) / 100.0
                discount = min(calc_disc, coupon["max"])
            else:
                discount = min(coupon["value"], subtotal)

    taxable_amount = max(0.0, subtotal - discount)
    cgst = taxable_amount * 0.09  # 9% CGST
    sgst = taxable_amount * 0.09  # 9% SGST
    taxes = cgst + sgst
    security_deposit = 50000.0  # Refundable deposit
    grand_total = taxable_amount + taxes + security_deposit

    return {
        "base_amount": base_price,
        "addons_amount": addons_total,
        "discount_amount": discount,
        "coupon_applied": coupon_title,
        "taxable_amount": taxable_amount,
        "cgst_amount": cgst,
        "sgst_amount": sgst,
        "taxes_amount": taxes,
        "security_deposit": security_deposit,
        "grand_total": grand_total,
        "breakdown_text": f"Base: ₹{base_price:,.0f} + Add-ons: ₹{addons_total:,.0f} - Disc: ₹{discount:,.0f} + 18% GST: ₹{taxes:,.0f} + Deposit: ₹{security_deposit:,.0f}"
    }

def get_weekend_checkout(check_in: date) -> date:
    """Check-in is Saturday morning, check-out is Sunday evening."""
    return check_in + timedelta(days=1)

