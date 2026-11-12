-- =====================================================================
-- JAI KRISHNA RAM 100-ACRE LUXURY FARMHOUSE & RESORT BACKEND SCHEMA
-- Target Database: MySQL 8.0+ / MariaDB / Cloud SQL / AWS Aurora
-- Compatible with: Python FastAPI / Flask / Node.js Express / Java Spring Boot / Ruby Sinatra
-- Inspired by: MakeMyTrip Hyderabad Resorts & Luxury Farmhouse Portals
-- =====================================================================

CREATE DATABASE IF NOT EXISTS jaikrishnaram_resort
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jaikrishnaram_resort;

-- ---------------------------------------------------------------------
-- 1. RESORTS / PROPERTIES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resorts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    slug VARCHAR(128) UNIQUE NOT NULL,
    property_type ENUM('LUXURY_FARMHOUSE', 'AGRITOURISM_SANCTUARY', 'HERITAGE_RESORT', 'ECO_RETREAT') DEFAULT 'LUXURY_FARMHOUSE',
    location_area VARCHAR(128) NOT NULL,
    city VARCHAR(64) NOT NULL DEFAULT 'Hyderabad',
    state VARCHAR(64) NOT NULL DEFAULT 'Telangana',
    postal_code VARCHAR(16) DEFAULT '500081',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    distance_from_hitec_city VARCHAR(32) DEFAULT '12 - 15 Mins',
    distance_from_airport VARCHAR(32) DEFAULT '35 Mins via ORR',
    total_acreage DECIMAL(6, 2) DEFAULT 100.00,
    base_weekend_price DECIMAL(12, 2) NOT NULL DEFAULT 500000.00,
    currency VARCHAR(8) DEFAULT 'INR',
    mmt_rating DECIMAL(3, 2) DEFAULT 4.90,
    review_count INT UNSIGNED DEFAULT 1420,
    star_category INT UNSIGNED DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city_area (city, location_area),
    INDEX idx_weekend_price (base_weekend_price)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. VILLAS AND ACCOMMODATION UNITS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS villas_and_suites (
    id VARCHAR(64) PRIMARY KEY,
    resort_id VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    unit_code VARCHAR(32) NOT NULL,
    category ENUM('FULL_100_ACRE_BUYOUT', 'CENTRAL_VILLA', 'WATERFALL_POOL_SUITE', 'AGRI_COTTAGE') NOT NULL,
    max_adults INT UNSIGNED NOT NULL DEFAULT 20,
    max_day_guests INT UNSIGNED NOT NULL DEFAULT 100,
    bedroom_count INT UNSIGNED DEFAULT 6,
    bathroom_count INT UNSIGNED DEFAULT 8,
    private_pool BOOLEAN DEFAULT TRUE,
    waterfall_access BOOLEAN DEFAULT TRUE,
    buffalo_sanctuary_access BOOLEAN DEFAULT TRUE,
    rate_per_night DECIMAL(10, 2) NOT NULL,
    description TEXT,
    featured_image VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE,
    INDEX idx_resort_category (resort_id, category)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. AMENITIES MASTER
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS amenities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    icon VARCHAR(64) NOT NULL,
    category ENUM('LEISURE', 'AGRITOURISM', 'DINING', 'WELLNESS', 'SECURITY', 'BUSINESS') DEFAULT 'LEISURE',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT UNSIGNED DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resort_amenities (
    resort_id VARCHAR(64) NOT NULL,
    amenity_id VARCHAR(64) NOT NULL,
    PRIMARY KEY (resort_id, amenity_id),
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. VIP ADD-ONS TABLE (MMT Style Enhancements)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS addons (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    billing_type ENUM('PER_WEEKEND', 'PER_GUEST', 'PER_HOUR') DEFAULT 'PER_WEEKEND',
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. DISCOUNT COUPONS & PROMOS (MakeMyTrip Style Engine)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    discount_type ENUM('PERCENTAGE', 'FLAT') NOT NULL DEFAULT 'PERCENTAGE',
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2) DEFAULT 50000.00,
    min_booking_amount DECIMAL(10, 2) DEFAULT 300000.00,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_limit INT UNSIGNED DEFAULT 100,
    used_count INT UNSIGNED DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. GUEST PROFILES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(128) NOT NULL,
    company_name VARCHAR(128),
    city VARCHAR(64) DEFAULT 'Hyderabad',
    vip_status ENUM('REGULAR', 'VIP', 'VVIP_FOUNDER') DEFAULT 'VIP',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. BOOKINGS / LEASES TABLE (Core Reservation Engine)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    booking_reference VARCHAR(32) UNIQUE NOT NULL,
    resort_id VARCHAR(64) NOT NULL,
    guest_id VARCHAR(64) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    check_in_time VARCHAR(16) DEFAULT '10:00 AM',
    check_out_time VARCHAR(16) DEFAULT '06:00 PM',
    guest_count INT UNSIGNED NOT NULL DEFAULT 15,
    event_type VARCHAR(64) NOT NULL,
    notes TEXT,
    
    -- Financials (INR)
    base_amount DECIMAL(12, 2) NOT NULL DEFAULT 500000.00,
    addons_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    coupon_id VARCHAR(64),
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    taxable_amount DECIMAL(12, 2) NOT NULL,
    cgst_amount DECIMAL(10, 2) NOT NULL, -- 9% CGST
    sgst_amount DECIMAL(10, 2) NOT NULL, -- 9% SGST
    grand_total DECIMAL(12, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL DEFAULT 50000.00,
    
    booking_status ENUM('CONFIRMED', 'PENDING_PAYMENT', 'HOLD', 'CANCELLED', 'COMPLETED') DEFAULT 'CONFIRMED',
    payment_status ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED') DEFAULT 'PAID',
    
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resort_id) REFERENCES resorts(id),
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    INDEX idx_dates (check_in_date, check_out_date),
    INDEX idx_status (booking_status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. BOOKING ADDONS LINK TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_addons (
    booking_id VARCHAR(64) NOT NULL,
    addon_id VARCHAR(64) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (booking_id, addon_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. PAYMENTS & TRANSACTIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL,
    transaction_ref VARCHAR(64) UNIQUE NOT NULL,
    payment_gateway ENUM('RAZORPAY', 'STRIPE', 'UPI_DIRECT', 'NEFT_RTGS', 'CASH_CONCIERGE') DEFAULT 'UPI_DIRECT',
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'INR',
    status ENUM('INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'SUCCESS',
    gateway_response JSON,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_txn (transaction_ref)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. REVIEWS & RATINGS TABLE (MMT Style Breakdown)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    resort_id VARCHAR(64) NOT NULL,
    guest_name VARCHAR(128) NOT NULL,
    guest_title VARCHAR(128),
    avatar_url VARCHAR(512),
    rating_overall DECIMAL(2, 1) NOT NULL,
    rating_cleanliness DECIMAL(2, 1) DEFAULT 5.0,
    rating_hospitality DECIMAL(2, 1) DEFAULT 5.0,
    rating_food DECIMAL(2, 1) DEFAULT 4.9,
    rating_location DECIMAL(2, 1) DEFAULT 5.0,
    rating_value DECIMAL(2, 1) DEFAULT 4.8,
    review_title VARCHAR(255) NOT NULL,
    review_text TEXT NOT NULL,
    stay_event_type VARCHAR(64),
    is_verified_stay BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE,
    INDEX idx_resort_rating (resort_id, rating_overall)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. AUDIT & CONCIERGE NOTIFICATION LOGS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(64),
    event_action VARCHAR(64) NOT NULL,
    description TEXT,
    performed_by VARCHAR(64) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_booking_event (booking_id, event_action)
) ENGINE=InnoDB;

