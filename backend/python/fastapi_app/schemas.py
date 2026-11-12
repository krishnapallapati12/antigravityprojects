"""
Pydantic v2 Validation Schemas for FastAPI
"""
from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, EmailStr

class AmenitySchema(BaseModel):
    id: str
    name: str
    icon: str
    category: str
    is_featured: bool

    class Config:
        from_attributes = True

class VillaSchema(BaseModel):
    id: str
    name: str
    unit_code: str
    category: str
    max_adults: int
    max_day_guests: int
    bedroom_count: int
    rate_per_night: float
    private_pool: bool
    waterfall_access: bool
    buffalo_sanctuary_access: bool
    description: Optional[str] = None
    featured_image: Optional[str] = None

    class Config:
        from_attributes = True

class ResortSummarySchema(BaseModel):
    id: str
    name: str
    tagline: Optional[str]
    slug: str
    location_area: str
    city: str
    distance_from_hitec_city: str
    total_acreage: float
    base_weekend_price: float
    mmt_rating: float
    review_count: int
    star_category: int
    amenities: List[AmenitySchema] = []

    class Config:
        from_attributes = True

class QuoteRequest(BaseModel):
    resort_id: str = "resort-jkr-100"
    check_in_date: date
    guest_count: int = Field(default=15, ge=1, le=100)
    selected_addon_ids: List[str] = []
    coupon_code: Optional[str] = None

class QuoteResponse(BaseModel):
    resort_name: str
    base_amount: float
    addons_amount: float
    discount_amount: float
    coupon_applied: Optional[str] = None
    taxable_amount: float
    cgst_rate_percent: float = 9.0
    cgst_amount: float
    sgst_rate_percent: float = 9.0
    sgst_amount: float
    security_deposit: float
    grand_total: float
    currency: str = "INR"
    breakdown_text: str

class BookingCreateRequest(BaseModel):
    resort_id: str = "resort-jkr-100"
    check_in_date: date
    guest_count: int = Field(default=15, ge=1, le=100)
    event_type: str = "Corporate Tech Offsite"
    selected_addon_ids: List[str] = []
    coupon_code: Optional[str] = None
    
    # Guest Details
    guest_name: str = Field(min_length=2, max_length=128)
    guest_phone: str = Field(min_length=10, max_length=15)
    guest_email: str
    guest_company: Optional[str] = None
    notes: Optional[str] = None

class BookingResponse(BaseModel):
    booking_reference: str
    status: str
    resort_name: str
    guest_name: str
    check_in_date: date
    check_out_date: date
    check_in_time: str
    check_out_time: str
    guest_count: int
    event_type: str
    base_amount: float
    addons_amount: float
    discount_amount: float
    taxes_amount: float
    grand_total: float
    whatsapp_concierge_url: str
    voucher_qr_payload: str
    created_at: datetime

class ReviewSchema(BaseModel):
    id: str
    guest_name: str
    guest_title: Optional[str]
    avatar_url: Optional[str]
    rating_overall: float
    rating_cleanliness: float
    rating_hospitality: float
    rating_food: float
    rating_location: float
    rating_value: float
    review_title: str
    review_text: str
    stay_event_type: Optional[str]
    is_verified_stay: bool

    class Config:
        from_attributes = True

