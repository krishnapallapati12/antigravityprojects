"""
SQLAlchemy ORM Models for Jai Krishna Ram Farmhouse & Resort Booking System
"""
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Date, DateTime, Text, ForeignKey, Table
)
from sqlalchemy.orm import relationship
from database import Base

# Association table for Resort to Amenities
resort_amenities_association = Table(
    'resort_amenities',
    Base.metadata,
    Column('resort_id', String(64), ForeignKey('resorts.id', ondelete="CASCADE"), primary_key=True),
    Column('amenity_id', String(64), ForeignKey('amenities.id', ondelete="CASCADE"), primary_key=True)
)

# Association table for Booking to Add-ons
booking_addons_association = Table(
    'booking_addons',
    Base.metadata,
    Column('booking_id', String(64), ForeignKey('bookings.id', ondelete="CASCADE"), primary_key=True),
    Column('addon_id', String(64), ForeignKey('addons.id', ondelete="CASCADE"), primary_key=True),
    Column('price', Float, nullable=False)
)

class Resort(Base):
    __tablename__ = "resorts"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    tagline = Column(String(255))
    slug = Column(String(128), unique=True, index=True)
    property_type = Column(String(64), default="LUXURY_FARMHOUSE")
    location_area = Column(String(128), nullable=False)
    city = Column(String(64), default="Hyderabad")
    state = Column(String(64), default="Telangana")
    postal_code = Column(String(16), default="500081")
    latitude = Column(Float)
    longitude = Column(Float)
    distance_from_hitec_city = Column(String(32), default="12 - 15 Mins")
    distance_from_airport = Column(String(32), default="35 Mins via ORR")
    total_acreage = Column(Float, default=100.0)
    base_weekend_price = Column(Float, default=500000.0)
    currency = Column(String(8), default="INR")
    mmt_rating = Column(Float, default=4.95)
    review_count = Column(Integer, default=1420)
    star_category = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)

    villas = relationship("Villa", back_populates="resort", cascade="all, delete-orphan")
    amenities = relationship("Amenity", secondary=resort_amenities_association)
    bookings = relationship("Booking", back_populates="resort")
    reviews = relationship("Review", back_populates="resort")

class Villa(Base):
    __tablename__ = "villas_and_suites"

    id = Column(String(64), primary_key=True, index=True)
    resort_id = Column(String(64), ForeignKey("resorts.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(128), nullable=False)
    unit_code = Column(String(32), nullable=False)
    category = Column(String(64), nullable=False)
    max_adults = Column(Integer, default=20)
    max_day_guests = Column(Integer, default=100)
    bedroom_count = Column(Integer, default=6)
    bathroom_count = Column(Integer, default=8)
    private_pool = Column(Boolean, default=True)
    waterfall_access = Column(Boolean, default=True)
    buffalo_sanctuary_access = Column(Boolean, default=True)
    rate_per_night = Column(Float, nullable=False)
    description = Column(Text)
    featured_image = Column(String(512))

    resort = relationship("Resort", back_populates="villas")

class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(String(64), primary_key=True)
    name = Column(String(128), nullable=False)
    icon = Column(String(64), nullable=False)
    category = Column(String(64), default="LEISURE")
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

class Addon(Base):
    __tablename__ = "addons"

    id = Column(String(64), primary_key=True)
    code = Column(String(32), unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    billing_type = Column(String(32), default="PER_WEEKEND")
    is_active = Column(Boolean, default=True)

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String(64), primary_key=True)
    code = Column(String(32), unique=True, index=True, nullable=False)
    title = Column(String(128), nullable=False)
    discount_type = Column(String(32), default="PERCENTAGE") # PERCENTAGE or FLAT
    discount_value = Column(Float, nullable=False)
    max_discount_amount = Column(Float, default=50000.0)
    min_booking_amount = Column(Float, default=300000.0)
    valid_from = Column(Date)
    valid_until = Column(Date)
    usage_limit = Column(Integer, default=100)
    used_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class Guest(Base):
    __tablename__ = "guests"

    id = Column(String(64), primary_key=True, index=True)
    full_name = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=False, index=True)
    email = Column(String(128), nullable=False, index=True)
    company_name = Column(String(128))
    city = Column(String(64), default="Hyderabad")
    vip_status = Column(String(32), default="VIP")
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="guest")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(64), primary_key=True, index=True)
    booking_reference = Column(String(32), unique=True, index=True, nullable=False)
    resort_id = Column(String(64), ForeignKey("resorts.id"), nullable=False)
    guest_id = Column(String(64), ForeignKey("guests.id"), nullable=False)
    check_in_date = Column(Date, nullable=False, index=True)
    check_out_date = Column(Date, nullable=False, index=True)
    check_in_time = Column(String(16), default="10:00 AM")
    check_out_time = Column(String(16), default="06:00 PM")
    guest_count = Column(Integer, default=15)
    event_type = Column(String(64), nullable=False)
    notes = Column(Text)

    base_amount = Column(Float, default=500000.0)
    addons_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    coupon_id = Column(String(64), ForeignKey("coupons.id"), nullable=True)
    taxable_amount = Column(Float, nullable=False)
    cgst_amount = Column(Float, nullable=False)
    sgst_amount = Column(Float, nullable=False)
    grand_total = Column(Float, nullable=False)
    security_deposit = Column(Float, default=50000.0)

    booking_status = Column(String(32), default="CONFIRMED")
    payment_status = Column(String(32), default="PAID")
    created_at = Column(DateTime, default=datetime.utcnow)

    resort = relationship("Resort", back_populates="bookings")
    guest = relationship("Guest", back_populates="bookings")
    addons = relationship("Addon", secondary=booking_addons_association)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(64), primary_key=True)
    resort_id = Column(String(64), ForeignKey("resorts.id", ondelete="CASCADE"), nullable=False)
    guest_name = Column(String(128), nullable=False)
    guest_title = Column(String(128))
    avatar_url = Column(String(512))
    rating_overall = Column(Float, nullable=False)
    rating_cleanliness = Column(Float, default=5.0)
    rating_hospitality = Column(Float, default=5.0)
    rating_food = Column(Float, default=4.9)
    rating_location = Column(Float, default=5.0)
    rating_value = Column(Float, default=4.8)
    review_title = Column(String(255), nullable=False)
    review_text = Column(Text, nullable=False)
    stay_event_type = Column(String(64))
    is_verified_stay = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    resort = relationship("Resort", back_populates="reviews")

