-- =====================================================================
-- JAI KRISHNA RAM 100-ACRE RESORT SEED DATA
-- Pre-populates the database with the Flagship Sanctuary and
-- Hyderabad resort comparisons (inspired by MakeMyTrip)
-- =====================================================================

USE jaikrishnaram_resort;

-- 1. SEED MASTER PROPERTIES / RESORTS
INSERT INTO resorts (id, name, tagline, slug, property_type, location_area, city, state, postal_code, latitude, longitude, distance_from_hitec_city, distance_from_airport, total_acreage, base_weekend_price, currency, mmt_rating, review_count, star_category)
VALUES
('resort-jkr-100', 'Jai Krishna Ram Farmhouse & 100-Acre Sanctuary', 'Exclusive 100-Acre Private Luxury Farmhouse & Agritourism Sanctuary', 'jaikrishnaram-farmhouse-hyderabad', 'LUXURY_FARMHOUSE', 'HITEC City Corridor / Madhapur', 'Hyderabad', 'Telangana', '500081', 17.4435, 78.3772, '12 - 15 Mins', '35 Mins via ORR', 100.00, 500000.00, 'INR', 4.95, 1420, 5),
('resort-golkonda-hyd', 'The Golkonda Resorts & Spa', 'Lakeside Luxury Villas & Tropical Haven', 'golkonda-resorts-hyderabad', 'HERITAGE_RESORT', 'Gandipet / Osman Sagar', 'Hyderabad', 'Telangana', '500075', 17.3871, 78.3184, '25 Mins', '30 Mins via ORR', 13.00, 24000.00, 'INR', 4.30, 3120, 5),
('resort-pragati-hyd', 'Pragati Green Resorts', 'Eco Agritourism Resort & Herbal Nature Sanctuary', 'pragati-resorts-hyderabad', 'AGRITOURISM_SANCTUARY', 'Chilkur / Shankarpally', 'Hyderabad', 'Telangana', '501203', 17.3712, 78.1925, '40 Mins', '45 Mins', 85.00, 18500.00, 'INR', 4.10, 2890, 4),
('resort-browntown-hyd', 'Brown Town Resort & Spa', 'Vintage Hyderabadi Estate & Pool Suites', 'brown-town-resort-hyderabad', 'HERITAGE_RESORT', 'Moinabad', 'Hyderabad', 'Telangana', '501504', 17.3245, 78.2711, '35 Mins', '40 Mins', 22.00, 21000.00, 'INR', 4.25, 1680, 4)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED VILLAS AND SUITES FOR JAI KRISHNA RAM
INSERT INTO villas_and_suites (id, resort_id, name, unit_code, category, max_adults, max_day_guests, bedroom_count, bathroom_count, private_pool, waterfall_access, buffalo_sanctuary_access, rate_per_night, description, featured_image)
VALUES
('villa-full-100-acres', 'resort-jkr-100', '100-Acre Private Buyout & Sanctuary Estate', 'JKR-100ACRE', 'FULL_100_ACRE_BUYOUT', 25, 100, 8, 10, TRUE, TRUE, TRUE, 500000.00, 'Complete private takeover of the entire 100-acre estate: Central Luxury Farmhouse Villa, Heated Swimming Pool, Cascading Natural Rock Waterfalls, 50-Acre Buffalo Sanctuary with 500 Buffalos, 25-Acre Flower Valleys, and 24/7 Armed Security.', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'),
('villa-central-oasis', 'resort-jkr-100', 'Central Farmhouse Presidential Villa', 'JKR-CENTRAL-VILLA', 'CENTRAL_VILLA', 12, 40, 4, 5, TRUE, TRUE, TRUE, 125000.00, 'The palatial architectural mansion at the center of 100 green acres featuring infinity pool terrace, private dining hall, and panoramic estate views.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'),
('villa-waterfall-suite', 'resort-jkr-100', 'The Cascading Waterfall Pool Pavilion', 'JKR-WATERFALL-STE', 'WATERFALL_POOL_SUITE', 6, 20, 2, 3, TRUE, TRUE, TRUE, 65000.00, 'Intimate luxury villa facing the cascading multi-tier natural stone waterfalls with private sundeck and mist chill lounge.', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80'),
('villa-agri-cottage', 'resort-jkr-100', 'The Dairy Sanctuary Agritourism Cottage', 'JKR-AGRI-COT', 'AGRI_COTTAGE', 4, 15, 2, 2, FALSE, FALSE, TRUE, 35000.00, 'Rustic luxury wooden cottage nestled on the edge of the 50-acre buffalo sanctuary with morning dairy tasting tours and flower field views.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. SEED AMENITIES
INSERT INTO amenities (id, name, icon, category, is_featured, display_order)
VALUES
('am-pool', 'Private Swimming Pool', 'waves', 'LEISURE', TRUE, 1),
('am-waterfall', 'Cascading Stone Waterfalls', 'droplet', 'LEISURE', TRUE, 2),
('am-buffalo', '500-Buffalo Sanctuary & Dairy Tour', 'shield', 'AGRITOURISM', TRUE, 3),
('am-flowers', '25+ Acres Blooming Flower Meadows', 'flower', 'AGRITOURISM', TRUE, 4),
('am-security', '24/7 Armed Security & CCTV Perimeter', 'lock', 'SECURITY', TRUE, 5),
('am-golfcarts', 'Electric Safari Golf Carts', 'truck', 'LEISURE', TRUE, 6),
('am-chef', 'Farm-to-Table Royal Catering', 'coffee', 'DINING', TRUE, 7),
('am-bonfire', 'Night Starlit Poolside Bonfire', 'flame', 'LEISURE', TRUE, 8),
('am-wifi', 'Gigabit High-Speed Starlink WiFi', 'wifi', 'BUSINESS', FALSE, 9),
('am-drone', '4K Drone Videography Approval', 'video', 'LEISURE', FALSE, 10),
('am-poultry', '10-Acre Free-Range Poultry Farm', 'sun', 'AGRITOURISM', FALSE, 11),
('am-valet', 'Private Valet Parking (50 Vehicles)', 'car', 'SECURITY', FALSE, 12)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Map amenities to Jai Krishna Ram Farmhouse
INSERT IGNORE INTO resort_amenities (resort_id, amenity_id)
SELECT 'resort-jkr-100', id FROM amenities;

-- 4. SEED VIP ADD-ONS
INSERT INTO addons (id, code, name, description, price, billing_type)
VALUES
('addon-catering', 'ROYAL_CATERING', 'Farm-to-Table Royal Hyderabadi Banquet (Lunch + Dinner + Breakfast)', 'Authentic Hyderabadi Dum Biryani, farm-fresh dairy paneer, organic vegetables, and live barbecue grill.', 75000.00, 'PER_WEEKEND'),
('addon-drone', 'DRONE_SHOOT', 'Cinematic 4K Drone & Ground Photography Package', 'Full weekend coverage with licensed 4K drone pilot, color-graded recap video, and 100+ edited photographs.', 35000.00, 'PER_WEEKEND'),
('addon-music', 'LIVE_MUSIC', 'Live Acoustic Gazebo & Sufi Music Performance', 'Private 3-hour evening starlit musical performance by renowned Hyderabad acoustic & ghazal artists.', 40000.00, 'PER_WEEKEND'),
('addon-golfcarts', 'GOLF_CARTS_FLEET', 'Fleet of 4 VIP Electric Golf Carts with Chauffeurs', 'Dedicated personal electric buggies available 24/7 for you and your guests to tour all 100 acres.', 20000.00, 'PER_WEEKEND')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. SEED DISCOUNT COUPONS (MakeMyTrip Style)
INSERT INTO coupons (id, code, title, discount_type, discount_value, max_discount_amount, min_booking_amount, valid_from, valid_until, usage_limit, is_active)
VALUES
('cp-mmthyd', 'MMTHYD2026', 'MakeMyTrip Exclusive Hyderabad Resort Special', 'PERCENTAGE', 10.00, 50000.00, 400000.00, '2026-01-01', '2026-12-31', 500, TRUE),
('cp-vip50', 'FARMHOUSEVIP', 'VIP Private Sanctuary Welcome Discount', 'FLAT', 25000.00, 25000.00, 450000.00, '2026-01-01', '2026-12-31', 200, TRUE),
('cp-earlybird', 'HITEC100', 'HITEC City Corporate Early Bird Privilege', 'PERCENTAGE', 8.00, 40000.00, 400000.00, '2026-01-01', '2026-12-31', 150, TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. SEED REVIEWS & RATINGS (MakeMyTrip Style Verification)
INSERT INTO reviews (id, resort_id, guest_name, guest_title, avatar_url, rating_overall, rating_cleanliness, rating_hospitality, rating_food, rating_location, rating_value, review_title, review_text, stay_event_type, is_verified_stay)
VALUES
('rev-1', 'resort-jkr-100', 'Siddharth Rao', 'Vice President, Enterprise Cloud (HITEC City Tech Major)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 5.0, 5.0, 5.0, 4.9, 5.0, 4.9, 'Unmatched 100-Acre Sanctuary 15 Mins from Cyber Towers', 'We leased the HITEC 100 estate for our annual leadership offsite of 40 directors. Having 100 acres completely to ourselves 15 minutes from Cyber Towers was unreal. The swimming pool, the waterfall sound, and the buffalo safari tour blew everyone away. Worth every rupee of the ₹5 Lakhs fee!', 'Corporate Tech Offsite', TRUE),
('rev-2', 'resort-jkr-100', 'Ananya & Rohan Kulkarni', 'Pre-Wedding Hosts (Banjara Hills)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'Dream Destination for Pre-Wedding & 4K Drone Shoot', 'We shot our pre-wedding cinematic video here. The combination of the modern luxury mansion with the rock waterfall and 25 acres of blooming flowers gave us shots that look like Tuscany and Bali combined! Our guests loved the Saturday night pool bonfire.', 'Pre-Wedding & Drone Shoot', TRUE),
('rev-3', 'resort-jkr-100', 'Dr. K. Ramachandra Murthy', 'Industrialist & Agricultural Connoisseur', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 5.0, 5.0, 5.0, 4.8, 5.0, 4.8, 'A True Agritourism Marvel in Hyderabad', 'As someone passionate about Indian livestock, seeing 500 Murrah buffalos housed with such immaculate hygiene, 10 acres of fresh green fodder, and paved roads is world-class. It is an agritourism triumph right in Hyderabad.', 'VIP Agritourism & Dairy Study', TRUE)
ON DUPLICATE KEY UPDATE review_title=VALUES(review_title);

