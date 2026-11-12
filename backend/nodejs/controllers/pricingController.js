/**
 * Dynamic Pricing Calculation Controller (MakeMyTrip Style)
 */
const ADDONS = {
  catering: { id: "catering", name: "Farm-to-Table Royal Hyderabadi Banquet", price: 75000 },
  drone: { id: "drone", name: "Cinematic 4K Drone Photography", price: 35000 },
  music: { id: "music", name: "Live Acoustic & Sufi Gazebo Performance", price: 40000 },
  golfcarts: { id: "golfcarts", name: "Fleet of 4 VIP Electric Golf Carts", price: 20000 }
};

const COUPONS = {
  MMTHYD2026: { type: "PERCENT", value: 10, max: 50000, name: "MakeMyTrip Hyderabad 10% Discount" },
  FARMHOUSEVIP: { type: "FLAT", value: 25000, max: 25000, name: "VIP Sanctuary Flat ₹25,000 Off" },
  HITEC100: { type: "PERCENT", value: 8, max: 40000, name: "HITEC City CXO 8% Discount" }
};

exports.calculateQuote = (req, res) => {
  try {
    const { basePrice = 500000, guestCount = 15, addons = [], couponCode } = req.body;

    let addonsTotal = 0;
    const selectedAddonsList = [];

    if (Array.isArray(addons)) {
      addons.forEach(key => {
        if (ADDONS[key]) {
          addonsTotal += ADDONS[key].price;
          selectedAddonsList.push(ADDONS[key]);
        }
      });
    }

    const subtotal = Number(basePrice) + addonsTotal;
    let discount = 0;
    let couponTitle = null;

    if (couponCode) {
      const code = String(couponCode).trim().toUpperCase();
      if (COUPONS[code]) {
        const c = COUPONS[code];
        couponTitle = c.name;
        if (c.type === "PERCENT") {
          discount = Math.min((subtotal * c.value) / 100, c.max);
        } else {
          discount = Math.min(c.value, subtotal);
        }
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const cgst = taxableAmount * 0.09; // 9% CGST
    const sgst = taxableAmount * 0.09; // 9% SGST
    const totalTaxes = cgst + sgst;
    const securityDeposit = 50000;
    const grandTotal = taxableAmount + totalTaxes + securityDeposit;

    return res.json({
      success: true,
      data: {
        resort: "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
        baseAmount: Number(basePrice),
        guestCount: Number(guestCount),
        addonsTotal,
        selectedAddons: selectedAddonsList,
        couponCode: couponCode || null,
        couponTitle,
        discountAmount: discount,
        taxableAmount,
        cgstAmount: cgst,
        sgstAmount: sgst,
        totalTaxes,
        securityDeposit,
        grandTotal,
        currency: "INR",
        formattedGrandTotal: `₹${grandTotal.toLocaleString("en-IN")}`
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

