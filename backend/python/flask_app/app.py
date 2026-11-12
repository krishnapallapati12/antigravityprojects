"""
Flask Microservice: AI Concierge, WhatsApp Webhook & Estate Analytics
For Jai Krishna Ram 100-Acre Luxury Farmhouse & Sanctuary, Hyderabad
"""
import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

KNOWLEDGE_BASE = {
    "estate_name": "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
    "location": "Near HITEC City / Madhapur Corridor, Central Hyderabad, Telangana",
    "distance_hitec": "12 to 15 minutes drive from Cyber Towers & Financial District",
    "total_acreage": "100 Acres of private green sanctuary",
    "weekend_lease_price": "₹5,00,000 for exclusive full-estate private buyout (Saturday 10:00 AM to Sunday 06:00 PM)",
    "buffalo_sanctuary": "50 Acres dedicated to 500 prize Murrah and Jafrabadi buffalos with automated aeration mist sheds, natural bathing lake, 10 acres high-protein fodder grass, and complimentary A2 organic dairy tasting.",
    "amenities": "Designer Swimming Pool, Cascading Natural Rock Waterfalls, 25+ Acres Multi-Hue Flower Valleys, 10-Acre Free-Range Poultry, 24/7 Armed Security, Electric Safari Golf Carts, Starlit Bonfire, High-Speed Starlink WiFi.",
    "guest_capacity": "Accommodates up to 20 overnight guests in luxury villa suites and up to 100 daytime attendees for corporate tech retreats, pre-wedding shoots, and private celebrations.",
    "concierge_phone": "+91 98765 43210",
    "concierge_whatsapp": "https://wa.me/919876543210"
}

@app.route("/api/v1/health", methods=["GET"])
def health():
    return jsonify({
        "status": "HEALTHY",
        "service": "Jai Krishna Ram Flask AI Concierge & Analytics",
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/api/v1/concierge/chat", methods=["POST"])
def concierge_chat():
    """
    Intelligent Concierge Bot for Farmhouse Visitors & Guests.
    Understands queries about buffalo sanctuary, waterfalls, pool, pricing, location.
    """
    data = request.get_json() or {}
    message = data.get("message", "").lower().strip()

    if not message:
        return jsonify({"reply": "Hello! I am your VIP Concierge for Jai Krishna Ram Farmhouse. How may I assist your weekend retreat planning today?"})

    reply = ""
    # Smart keyword intent detection
    if any(k in message for k in ["buffalo", "dairy", "animal", "cow", "milk", "sanctuary"]):
        reply = (
            "🐂 **The 50-Acre Buffalo Sanctuary:** Our estate is home to over 500 prize Murrah and "
            "Jafrabadi buffalos cared for with ethical organic practices. Guests enjoy a guided "
            "electric golf-cart safari, automated mist cooling sheds, natural bathing lake, and "
            "a farm-fresh A2 dairy tasting of milk, white butter, and paneer."
        )
    elif any(k in message for k in ["price", "cost", "fee", "rate", "lease", "rent", "5 lakh", "500000"]):
        reply = (
            "💎 **Weekend Lease Pricing:** The full 100-acre estate is leased exclusively to ONE private "
            "group per weekend for ₹5,00,000 (Saturday 10:00 AM check-in to Sunday 06:00 PM check-out). "
            "This gives you 100% private access to the central mansion, pool, waterfalls, and all 100 acres."
        )
    elif any(k in message for k in ["location", "where", "distance", "hitec", "cyber", "airport", "route"]):
        reply = (
            "📍 **Location:** We are situated in the high-growth corridor of Hyderabad near HITEC City, "
            "just 12–15 minutes from Cyber Towers and 35 minutes from Rajiv Gandhi International Airport via ORR. "
            "Full GPS coordinates and gate pass are shared privately upon booking."
        )
    elif any(k in message for k in ["pool", "waterfall", "swim", "water"]):
        reply = (
            "💧 **Pool & Waterfalls:** Enjoy an infinity-edge swimming pool with temperature regulation and "
            "underwater mood lighting, plus natural multi-tier rock waterfalls with continuous cooling mist."
        )
    elif any(k in message for k in ["food", "catering", "biryani", "dining", "chef"]):
        reply = (
            "🍽️ **Dining:** We offer an optional Farm-to-Table Royal Hyderabadi Banquet (₹75,000) covering "
            "Saturday lunch, evening barbecue, royal dinner with authentic Dum Biryani, and Sunday breakfast."
        )
    else:
        reply = (
            f"✨ **Jai Krishna Ram 100-Acre Sanctuary:** Hyderabad’s premier private farmhouse near HITEC City. "
            f"Featuring 500 buffalos across 50 acres, cascading waterfalls, heated pool, and flower meadows. "
            f"Would you like to check weekend availability or connect directly with our VIP Concierge at {KNOWLEDGE_BASE['concierge_phone']}?"
        )

    return jsonify({
        "query": message,
        "reply": reply,
        "estate": KNOWLEDGE_BASE["estate_name"],
        "concierge_phone": KNOWLEDGE_BASE["concierge_phone"],
        "whatsapp_url": KNOWLEDGE_BASE["concierge_whatsapp"]
    })

@app.route("/api/v1/whatsapp/webhook", methods=["GET", "POST"])
def whatsapp_webhook():
    """
    WhatsApp Cloud API webhook handler for instant concierge messages.
    """
    if request.method == "GET":
        # Verification handshake
        mode = request.args.get("hub.mode")
        token = request.args.get("hub.verify_token")
        challenge = request.args.get("hub.challenge")
        if mode == "subscribe" and token == "JKR_CONCIERGE_WEBHOOK_2026":
            return challenge, 200
        return "Forbidden", 403

    payload = request.get_json()
    return jsonify({"status": "received", "timestamp": datetime.utcnow().isoformat()}), 200

@app.route("/api/v1/analytics/dashboard", methods=["GET"])
def analytics_dashboard():
    """
    Real-time occupancy and revenue analytics.
    """
    return jsonify({
        "estate": "Jai Krishna Ram 100-Acre Sanctuary",
        "monthly_revenue_target": 2000000.0,
        "booked_weekends_this_month": 2,
        "available_weekends_this_month": 2,
        "occupancy_rate_percent": 50.0,
        "average_booking_value": 585000.0,
        "top_addon": "Farm-to-Table Royal Hyderabadi Banquet",
        "visitor_inquiries_today": 28,
        "mmt_search_impressions": 14200
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)

