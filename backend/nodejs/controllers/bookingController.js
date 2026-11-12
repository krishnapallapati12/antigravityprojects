/**
 * Booking & Voucher Controller
 */
const crypto = require("crypto");

const inMemoryBookings = new Map();

exports.createBooking = (req, res) => {
  try {
    const {
      guestName,
      guestPhone,
      guestEmail,
      checkInDate,
      guestCount = 15,
      eventType = "Corporate Tech Offsite",
      addons = [],
      couponCode,
      notes
    } = req.body;

    if (!guestName || !guestPhone || !checkInDate) {
      return res.status(400).json({
        success: false,
        message: "guestName, guestPhone, and checkInDate are required."
      });
    }

    const refId = `JKR-HYD-2026-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 1);

    // Calculate quote
    let addonsTotal = 0;
    const ADDONS_MAP = {
      catering: 75000,
      drone: 35000,
      music: 40000,
      golfcarts: 20000
    };
    (addons || []).forEach(a => {
      if (ADDONS_MAP[a]) addonsTotal += ADDONS_MAP[a];
    });

    const baseAmount = 500000;
    const subtotal = baseAmount + addonsTotal;
    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === "MMTHYD2026") {
      discount = Math.min((subtotal * 10) / 100, 50000);
    }

    const taxable = Math.max(0, subtotal - discount);
    const taxes = taxable * 0.18;
    const securityDeposit = 50000;
    const grandTotal = taxable + taxes + securityDeposit;

    const bookingRecord = {
      reference: refId,
      status: "CONFIRMED",
      resortName: "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
      guest: {
        name: guestName,
        phone: guestPhone,
        email: guestEmail || ""
      },
      stay: {
        checkInDate: checkIn.toISOString().split("T")[0],
        checkOutDate: checkOut.toISOString().split("T")[0],
        checkInTime: "Saturday 10:00 AM",
        checkOutTime: "Sunday 06:00 PM",
        guestCount: Number(guestCount),
        eventType
      },
      pricing: {
        baseAmount,
        addonsTotal,
        discount,
        taxable,
        taxes,
        securityDeposit,
        grandTotal,
        formattedTotal: `₹${grandTotal.toLocaleString("en-IN")}`
      },
      notes: notes || "",
      createdAt: new Date().toISOString()
    };

    inMemoryBookings.set(refId, bookingRecord);

    const waMsg = encodeURIComponent(
      `Hello Jai Krishna Ram Concierge! I have requested a 100-Acre Weekend Lease.\n\n*Ref:* ${refId}\n*Guest:* ${guestName}\n*Weekend:* ${bookingRecord.stay.checkInDate}\n*Guests:* ${guestCount}\n*Quotation:* ₹${grandTotal.toLocaleString("en-IN")}\n\nPlease confirm our gate pass & VIP access.`
    );

    return res.status(201).json({
      success: true,
      message: "Weekend Lease Voucher Generated Successfully",
      data: {
        ...bookingRecord,
        whatsappConciergeUrl: `https://wa.me/919876543210?text=${waMsg}`,
        qrPayload: `VALID-JKR-LEASE:${refId}:${guestName}:${checkInDate}`
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBooking = (req, res) => {
  const { refId } = req.params;
  const booking = inMemoryBookings.get(refId);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking voucher not found" });
  }
  return res.json({ success: true, data: booking });
};

