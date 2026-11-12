"""
FastAPI Microservice for Jai Krishna Ram 100-Acre Luxury Farmhouse & Hyderabad Resorts
Provides MakeMyTrip style resort search, real-time availability, dynamic pricing, and booking creation.
"""
import uuid
import urllib.parse
from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas
from pricing_engine import calculate_quote, get_weekend_checkout, VALID_COUPONS

# Create tables in SQLite / MySQL automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Jai Krishna Ram Farmhouse & Resort Booking API",
    description="Enterprise Booking & Reservation Engine inspired by MakeMyTrip Hyderabad Resorts",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React and local file testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# HEALTH & METRICS ENDPOINT
# ---------------------------------------------------------------------
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "HEALTHY",
        "service": "Jai Krishna Ram Farmhouse Backend (FastAPI)",
        "estate": "100-Acre Private Sanctuary near HITEC City, Hyderabad",
        "timestamp": datetime.utcnow().isoformat(),
        "database": str(engine.url)
    }

# ---------------------------------------------------------------------
# RESORTS & VILLAS CATALOG (MakeMyTrip Hyderabad Style)
# ---------------------------------------------------------------------
@app.get("/api/v1/resorts", response_model=List[schemas.ResortSummarySchema], tags=["Resorts"])
def list_resorts(
    city: str = Query("Hyderabad", description="Filter by city"),
    property_type: Optional[str] = Query(None, description="Filter: LUXURY_FARMHOUSE, AGRITOURISM_SANCTUARY, HERITAGE_RESORT"),
    min_rating: Optional[float] = Query(None, description="Minimum MMT guest rating (e.g. 4.5)"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Resort).filter(models.Resort.is_active == True)
    if city:
        query = query.filter(models.Resort.city.ilike(f"%{city}%"))
    if property_type:
        query = query.filter(models.Resort.property_type == property_type)
    if min_rating:
        query = query.filter(models.Resort.mmt_rating >= min_rating)

    resorts = query.all()

    # If database is fresh / empty, return hardcoded flagship data
    if not resorts:
        return [
            schemas.ResortSummarySchema(
                id="resort-jkr-100",
                name="Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
                tagline="Exclusive 100-Acre Private Luxury Farmhouse & Agritourism Sanctuary",
                slug="jaikrishnaram-farmhouse-hyderabad",
                location_area="HITEC City Corridor / Madhapur",
                city="Hyderabad",
                distance_from_hitec_city="12 - 15 Mins",
                total_acreage=100.0,
                base_weekend_price=500000.0,
                mmt_rating=4.95,
                review_count=1420,
                star_category=5,
                amenities=[
                    schemas.AmenitySchema(id="am-pool", name="Private Swimming Pool", icon="waves", category="LEISURE", is_featured=True),
                    schemas.AmenitySchema(id="am-waterfall", name="Cascading Stone Waterfalls", icon="droplet", category="LEISURE", is_featured=True),
                    schemas.AmenitySchema(id="am-buffalo", name="500-Buffalo Sanctuary & Dairy Tour", icon="shield", category="AGRITOURISM", is_featured=True),
                    schemas.AmenitySchema(id="am-flowers", name="25+ Acres Flower Meadows", icon="flower", category="AGRITOURISM", is_featured=True)
                ]
            )
        ]

    return resorts

@app.get("/api/v1/resorts/{resort_id}", tags=["Resorts"])
def get_resort_detail(resort_id: str, db: Session = Depends(get_db)):
    resort = db.query(models.Resort).filter(models.Resort.id == resort_id).first()
    if not resort and resort_id == "resort-jkr-100":
        return {
            "id": "resort-jkr-100",
            "name": "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
            "tagline": "Exclusive 100-Acre Private Luxury Farmhouse & Agritourism Sanctuary",
            "location": "HITEC City / Madhapur Corridor, Hyderabad, Telangana",
            "distance": "12 - 15 Mins from Cyber Towers",
            "acreage": 100.0,
            "weekend_lease_price": 500000.0,
            "features": [
                "100 Acres Private Exclusive Buyout",
                "Heated Swimming Pool & Underwater Mood Lighting",
                "Natural Rock Cascading Waterfalls",
                "50-Acre Buffalo Sanctuary with 500 Murrah Buffalos",
                "25+ Acres Multi-Hue Flower Meadows",
                "10-Acre Free-Range Poultry Farm",
                "24/7 Uniformed & Armed Security"
            ]
        }
    if not resort:
        raise HTTPException(status_code=404, detail="Resort not found")
    return resort

# ---------------------------------------------------------------------
# REAL-TIME AVAILABILITY CALENDAR
# ---------------------------------------------------------------------
@app.get("/api/v1/availability", tags=["Availability"])
def check_availability(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Returns upcoming weekend availability status.
    Strictly 1 exclusive group allowed per weekend (Saturday & Sunday).
    """
    today = date.today()
    slots = []

    # Calculate next 8 upcoming weekends
    for i in range(8):
        days_ahead = (5 - today.weekday() + 7) % 7 + (i * 7)
        if days_ahead == 0:
            days_ahead = 7
        sat = today + timedelta(days=days_ahead)
        sun = sat + timedelta(days=1)
        
        # Check if already booked in database
        booking_count = db.query(models.Booking).filter(
            models.Booking.check_in_date == sat,
            models.Booking.booking_status == "CONFIRMED"
        ).count()

        is_available = (booking_count == 0)

        slots.append({
            "weekend_id": f"WKD-{sat.strftime('%Y%m%d')}",
            "saturday_checkin": sat.isoformat(),
            "sunday_checkout": sun.isoformat(),
            "label": f"{sat.strftime('%b %d')} - {sun.strftime('%b %d, %Y')}",
            "is_available": is_available,
            "status": "Available for Exclusive Lease" if is_available else "Reserved / Leased",
            "price": 500000.0
        })

    return {
        "resort_id": "resort-jkr-100",
        "resort_name": "Jai Krishna Ram 100-Acre Sanctuary",
        "policy": "Exclusive full 100-acre buyout strictly limited to 1 group per weekend (Sat 10:00 AM - Sun 06:00 PM)",
        "slots": slots
    }

# ---------------------------------------------------------------------
# DYNAMIC PRICING QUOTATION ENGINE
# ---------------------------------------------------------------------
@app.post("/api/v1/pricing/quote", response_model=schemas.QuoteResponse, tags=["Pricing"])
def get_price_quotation(payload: schemas.QuoteRequest):
    quote = calculate_quote(
        base_price=500000.0,
        guest_count=payload.guest_count,
        selected_addons=payload.selected_addon_ids,
        coupon_code=payload.coupon_code
    )

    return schemas.QuoteResponse(
        resort_name="Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
        base_amount=quote["base_amount"],
        addons_amount=quote["addons_amount"],
        discount_amount=quote["discount_amount"],
        coupon_applied=quote["coupon_applied"],
        taxable_amount=quote["taxable_amount"],
        cgst_rate_percent=9.0,
        cgst_amount=quote["cgst_amount"],
        sgst_rate_percent=9.0,
        sgst_amount=quote["sgst_amount"],
        security_deposit=quote["security_deposit"],
        grand_total=quote["grand_total"],
        currency="INR",
        breakdown_text=quote["breakdown_text"]
    )

# ---------------------------------------------------------------------
# COUPON VALIDATOR
# ---------------------------------------------------------------------
@app.post("/api/v1/coupons/verify", tags=["Pricing"])
def verify_coupon(code: str = Query(..., description="Promo code like MMTHYD2026")):
    c_upper = code.strip().upper()
    if c_upper in VALID_COUPONS:
        coupon = VALID_COUPONS[c_upper]
        return {
            "valid": True,
            "code": c_upper,
            "title": coupon["title"],
            "discount_type": coupon["type"],
            "discount_value": coupon["value"],
            "message": f"Coupon {c_upper} applied successfully!"
        }
    raise HTTPException(status_code=400, detail="Invalid or expired promo code.")

# ---------------------------------------------------------------------
# RESERVATION & BOOKING ENGINE
# ---------------------------------------------------------------------
@app.post("/api/v1/bookings", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED, tags=["Bookings"])
def create_booking(payload: schemas.BookingCreateRequest, db: Session = Depends(get_db)):
    # 1. Calculate price
    quote = calculate_quote(
        base_price=500000.0,
        guest_count=payload.guest_count,
        selected_addons=payload.selected_addon_ids,
        coupon_code=payload.coupon_code
    )

    check_out = get_weekend_checkout(payload.check_in_date)
    ref_id = f"JKR-HYD-2026-{uuid.uuid4().hex[:6].upper()}"

    # 2. Check for double booking
    existing = db.query(models.Booking).filter(
        models.Booking.check_in_date == payload.check_in_date,
        models.Booking.booking_status == "CONFIRMED"
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="This weekend has already been reserved. Please select another upcoming weekend."
        )

    # 3. Create or find guest
    guest = db.query(models.Guest).filter(models.Guest.phone == payload.guest_phone).first()
    if not guest:
        guest = models.Guest(
            id=str(uuid.uuid4()),
            full_name=payload.guest_name,
            phone=payload.guest_phone,
            email=payload.guest_email,
            company_name=payload.guest_company,
            city="Hyderabad",
            vip_status="VIP",
            notes=payload.notes
        )
        db.add(guest)
        db.flush()

    # 4. Save booking
    booking = models.Booking(
        id=str(uuid.uuid4()),
        booking_reference=ref_id,
        resort_id=payload.resort_id,
        guest_id=guest.id,
        check_in_date=payload.check_in_date,
        check_out_date=check_out,
        check_in_time="10:00 AM",
        check_out_time="06:00 PM",
        guest_count=payload.guest_count,
        event_type=payload.event_type,
        notes=payload.notes,
        base_amount=quote["base_amount"],
        addons_amount=quote["addons_amount"],
        discount_amount=quote["discount_amount"],
        taxable_amount=quote["taxable_amount"],
        cgst_amount=quote["cgst_amount"],
        sgst_amount=quote["sgst_amount"],
        grand_total=quote["grand_total"],
        security_deposit=quote["security_deposit"],
        booking_status="CONFIRMED",
        payment_status="PAID"
    )
    db.add(booking)
    db.commit()

    # 5. WhatsApp Concierge URL
    wa_message = f"Hello Jai Krishna Ram Concierge! I have submitted a reservation for the 100-Acre Farmhouse near HITEC City.\n\n*Booking Ref:* {ref_id}\n*Guest:* {payload.guest_name}\n*Weekend:* {payload.check_in_date} to {check_out}\n*Guests:* {payload.guest_count}\n*Total:* ₹{quote['grand_total']:,.0f}\n\nPlease confirm our VIP access details."
    wa_encoded = urllib.parse.quote(wa_message)
    wa_url = f"https://wa.me/919876543210?text={wa_encoded}"

    return schemas.BookingResponse(
        booking_reference=ref_id,
        status="CONFIRMED",
        resort_name="Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
        guest_name=payload.guest_name,
        check_in_date=payload.check_in_date,
        check_out_date=check_out,
        check_in_time="10:00 AM",
        check_out_time="06:00 PM",
        guest_count=payload.guest_count,
        event_type=payload.event_type,
        base_amount=quote["base_amount"],
        addons_amount=quote["addons_amount"],
        discount_amount=quote["discount_amount"],
        taxes_amount=quote["taxes_amount"],
        grand_total=quote["grand_total"],
        whatsapp_concierge_url=wa_url,
        voucher_qr_payload=f"VALID-JKR-ESTATE-LEASE:{ref_id}:{payload.guest_name}:{payload.check_in_date}",
        created_at=datetime.utcnow()
    )

@app.get("/api/v1/bookings/{ref_id}", tags=["Bookings"])
def get_booking_voucher(ref_id: str, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.booking_reference == ref_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking reference not found")
    return booking

# ---------------------------------------------------------------------
# REVIEWS & TESTIMONIALS (MakeMyTrip Style)
# ---------------------------------------------------------------------
@app.get("/api/v1/reviews", response_model=List[schemas.ReviewSchema], tags=["Reviews"])
def get_reviews(db: Session = Depends(get_db)):
    reviews = db.query(models.Review).all()
    if not reviews:
        return [
            schemas.ReviewSchema(
                id="rev-1",
                guest_name="Siddharth Rao",
                guest_title="Vice President, Enterprise Cloud (HITEC City Tech Major)",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                rating_overall=5.0,
                rating_cleanliness=5.0,
                rating_hospitality=5.0,
                rating_food=4.9,
                rating_location=5.0,
                rating_value=4.9,
                review_title="Unmatched 100-Acre Sanctuary 15 Mins from Cyber Towers",
                review_text="We leased the HITEC 100 estate for our annual leadership offsite of 40 directors. Having 100 acres completely to ourselves 15 minutes from Cyber Towers was unreal. The swimming pool, the waterfall sound, and the buffalo safari tour blew everyone away. Worth every rupee of the ₹5 Lakhs fee!",
                stay_event_type="Corporate Tech Offsite",
                is_verified_stay=True
            ),
            schemas.ReviewSchema(
                id="rev-2",
                guest_name="Ananya & Rohan Kulkarni",
                guest_title="Pre-Wedding Destination Hosts (Banjara Hills)",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                rating_overall=5.0,
                rating_cleanliness=5.0,
                rating_hospitality=5.0,
                rating_food=5.0,
                rating_location=5.0,
                rating_value=5.0,
                review_title="Dream Destination for Pre-Wedding & 4K Drone Shoot",
                review_text="We shot our pre-wedding cinematic video here. The combination of the modern luxury mansion with the rock waterfall and 25 acres of blooming flowers gave us shots that look like Tuscany and Bali combined! Our guests loved the Saturday night pool bonfire.",
                stay_event_type="Pre-Wedding & Drone Shoot",
                is_verified_stay=True
            ),
            schemas.ReviewSchema(
                id="rev-3",
                guest_name="Dr. K. Ramachandra Murthy",
                guest_title="Industrialist & Agricultural Connoisseur",
                avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                rating_overall=5.0,
                rating_cleanliness=5.0,
                rating_hospitality=5.0,
                rating_food=4.8,
                rating_location=5.0,
                rating_value=4.8,
                review_title="A True Agritourism Marvel in Hyderabad",
                review_text="As someone passionate about Indian livestock, seeing 500 Murrah buffalos housed with such immaculate hygiene, 10 acres of fresh green fodder, and paved roads is world-class. It is an agritourism triumph right in Hyderabad.",
                stay_event_type="VIP Agritourism & Dairy Study",
                is_verified_stay=True
            )
        ]
    return reviews

