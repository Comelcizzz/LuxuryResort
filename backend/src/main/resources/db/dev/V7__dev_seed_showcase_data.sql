-- Rich showcase seed for the diploma demo.
-- Password for all demo users below: Passw0rd!

INSERT INTO users (id, first_name, last_name, email, phone, password_hash, role, is_active, loyalty_points, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0101', 'Olivia', 'Hart', 'admin.showcase@luxuryresort.local', '+380501110101', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'ADMIN', true, 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0102', 'Daniel', 'Brooks', 'manager.showcase@luxuryresort.local', '+380501110102', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'MANAGER', true, 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0103', 'Marta', 'Koval', 'reception.showcase@luxuryresort.local', '+380501110103', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'RECEPTIONIST', true, 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'Sofia', 'Melnyk', 'guest.showcase@luxuryresort.local', '+380501110104', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'GUEST', true, 1240, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'Emma', 'Stone', 'emma.stone@example.test', '+380501110105', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'GUEST', true, 820, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'Andrii', 'Shevchenko', 'andrii.shevchenko@example.test', '+380501110106', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'GUEST', true, 430, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'Nina', 'Parker', 'nina.parker@example.test', '+380501110107', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'GUEST', true, 1560, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'Mark', 'Taylor', 'mark.taylor@example.test', '+380501110108', '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'GUEST', true, 310, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    loyalty_points = EXCLUDED.loyalty_points,
    updated_at = NOW();

INSERT INTO rooms (
    id, name, description, base_price_per_night, room_type, max_occupancy, size_sqm, floor, room_number, status,
    amenities, images, avg_rating, review_count, created_at, updated_at
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0201', 'Azure Standard Room', 'Bright standard room with a queen bed, city-facing windows, blackout curtains, rain shower, work desk, and fast Wi-Fi for short business or weekend stays.', 3400.00, 'STANDARD', 2, 26.0, 2, '201', 'AVAILABLE', '["High-speed Wi-Fi","Queen bed","Rain shower","Work desk","Smart TV","Blackout curtains"]'::jsonb, '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=75","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=75"]'::jsonb, 4.62, 28, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0202', 'Garden Patio Standard', 'Quiet room with direct patio access, garden seating, warm lighting, ergonomic workspace, and compact storage for two guests.', 3600.00, 'STANDARD', 2, 28.0, 1, '118', 'AVAILABLE', '["Garden patio","Wi-Fi","Smart TV","Tea station","Safe","Rain shower"]'::jsonb, '["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=75","https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=75"]'::jsonb, 4.55, 21, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0203', 'Executive Twin Deluxe', 'Deluxe twin room designed for colleagues or friends: two premium beds, lounge chair, coffee machine, and generous luggage space.', 4800.00, 'DELUXE', 2, 34.0, 4, '412', 'AVAILABLE', '["Twin beds","Coffee machine","Mini-bar","Lounge chair","USB-C charging","Iron"]'::jsonb, '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=75","https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=75"]'::jsonb, 4.71, 34, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0204', 'Skyline King Deluxe', 'King room with panoramic skyline view, premium linen, reading nook, marble bathroom, and late-night room service priority.', 5600.00, 'DELUXE', 2, 39.0, 6, '609', 'AVAILABLE', '["Skyline view","King bed","Marble bathroom","Nespresso","Mini-bar","Priority room service"]'::jsonb, '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=75","https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=75"]'::jsonb, 4.83, 46, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0205', 'Wellness Deluxe', 'Calm deluxe room near the spa floor with yoga mat, aromatherapy kit, bathtub, and a sleep-friendly lighting preset.', 6100.00, 'DELUXE', 2, 41.0, 5, '518', 'AVAILABLE', '["Yoga mat","Aromatherapy kit","Bathtub","Smart lighting","Wi-Fi","Mini-bar"]'::jsonb, '["https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&q=75","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=75"]'::jsonb, 4.78, 32, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0206', 'Family Garden Suite', 'Large suite with separate bedroom and living area, pull-out sofa, kids welcome kit, garden view, and a dining table for family breakfasts.', 8200.00, 'SUITE', 4, 62.0, 3, '305', 'AVAILABLE', '["Separate living area","Kids welcome kit","Sofa bed","Dining table","Bathtub","Garden view"]'::jsonb, '["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=75","https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=75"]'::jsonb, 4.87, 41, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0207', 'Executive Corner Suite', 'Corner suite with two-sided city view, separate lounge, meeting table for four, espresso bar, and a deep soaking bathtub.', 10600.00, 'SUITE', 3, 76.0, 8, '808', 'AVAILABLE', '["Corner view","Meeting table","Espresso bar","Deep bathtub","Bluetooth speaker","Premium Wi-Fi"]'::jsonb, '["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=75","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=75"]'::jsonb, 4.91, 26, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0208', 'Honeymoon Terrace Suite', 'Romantic suite with a private terrace, bathtub by the window, evening turndown service, flowers, and sparkling wine on arrival.', 12800.00, 'SUITE', 2, 82.0, 7, '704', 'AVAILABLE', '["Private terrace","Window bathtub","Turndown service","Sparkling wine","Flowers","Late checkout"]'::jsonb, '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=75","https://images.unsplash.com/photo-1521783988139-89397d761dce?w=1200&q=75"]'::jsonb, 4.96, 38, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0209', 'Presidential Residence', 'Flagship residence with private dining room, terrace jacuzzi, personal butler, separate office, fireplace, and premium panoramic view.', 22000.00, 'PRESIDENTIAL', 4, 132.0, 10, '1002', 'AVAILABLE', '["Private dining room","Terrace jacuzzi","Butler service","Fireplace","Office","Premium minibar"]'::jsonb, '["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=75","https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=75"]'::jsonb, 5.00, 19, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0210', 'Royal Panorama Penthouse', 'Top-floor penthouse with wraparound terrace, full lounge, private chef option, dressing room, and VIP airport transfer coordination.', 26500.00, 'PRESIDENTIAL', 4, 156.0, 11, '1101', 'AVAILABLE', '["Wraparound terrace","Private chef option","Dressing room","Butler service","Jacuzzi","VIP transfer"]'::jsonb, '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=75","https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=75"]'::jsonb, 5.00, 14, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0211', 'Business Compact Room', 'Efficient room for solo business guests with standing desk, printer access on request, fast Wi-Fi, and quiet courtyard orientation.', 3100.00, 'STANDARD', 1, 22.0, 2, '226', 'AVAILABLE', '["Standing desk","Fast Wi-Fi","Smart TV","Courtyard view","Safe","Shower"]'::jsonb, '["https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200&q=75"]'::jsonb, 4.41, 17, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0212', 'Accessible Deluxe Room', 'Accessible deluxe room with step-free entry, wide bathroom layout, support rails, lowered switches, and comfortable king bed.', 5200.00, 'DELUXE', 2, 43.0, 2, '230', 'AVAILABLE', '["Accessible bathroom","Step-free entry","Support rails","King bed","Wi-Fi","Emergency call button"]'::jsonb, '["https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=75"]'::jsonb, 4.69, 12, NOW(), NOW())
ON CONFLICT (room_number) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price_per_night = EXCLUDED.base_price_per_night,
    room_type = EXCLUDED.room_type,
    max_occupancy = EXCLUDED.max_occupancy,
    size_sqm = EXCLUDED.size_sqm,
    floor = EXCLUDED.floor,
    status = EXCLUDED.status,
    amenities = EXCLUDED.amenities,
    images = EXCLUDED.images,
    avg_rating = EXCLUDED.avg_rating,
    review_count = EXCLUDED.review_count,
    updated_at = NOW();

INSERT INTO services (
    id, name, description, category, price, duration_minutes, max_participants, images, is_available, popularity_score, created_at
) VALUES
('cccccccc-cccc-cccc-cccc-cccccccc0201', 'Signature Renewal Spa Journey', 'A complete two-hour ritual with exfoliation, hot-stone massage, aromatherapy, herbal tea, and quiet-room recovery time.', 'SPA', 4600.00, 120, 1, '["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=75"]'::jsonb, true, 97.2, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0202', 'Couples Candlelight Massage', 'Side-by-side massage for two guests with warm oils, candlelight setup, and a glass of sparkling wine after the session.', 'SPA', 5200.00, 90, 2, '["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=75"]'::jsonb, true, 91.6, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0203', 'Private Chef Tasting Menu', 'Six-course seasonal dinner prepared by the chef with wine pairing, allergy-friendly substitutions, and tableside presentation.', 'DINING', 3800.00, 150, 2, '["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=75"]'::jsonb, true, 88.4, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0204', 'Breakfast in Bed', 'Premium breakfast tray delivered to the room with fresh pastries, fruit, eggs, coffee, juice, and optional champagne add-on.', 'DINING', 1250.00, 35, 2, '["https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=75"]'::jsonb, true, 72.3, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0205', 'Personal Training Session', 'One-on-one training with body assessment, strength plan, stretching block, and post-workout smoothie.', 'FITNESS', 1400.00, 60, 1, '["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=75"]'::jsonb, true, 69.8, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0206', 'Sunrise Rooftop Yoga', 'Small-group yoga session on the rooftop terrace with mats, towels, herbal water, and a calm morning playlist.', 'FITNESS', 900.00, 60, 12, '["https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=75"]'::jsonb, true, 76.1, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0207', 'Old Town Private Walk', 'Private guided walk through the historic city center with photo stops, coffee break, and local stories.', 'EXCURSION', 1700.00, 180, 6, '["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=75"]'::jsonb, true, 63.7, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0208', 'Mountain Day Escape', 'Full-day mountain excursion with private transfer, guide, picnic basket, and scenic viewpoint route.', 'EXCURSION', 4200.00, 420, 8, '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=75"]'::jsonb, true, 82.9, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0209', 'Premium Airport Transfer', 'Meet-and-greet airport transfer in a business-class vehicle with luggage help and flight tracking.', 'TRANSFER', 2100.00, 50, 3, '["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=75"]'::jsonb, true, 79.5, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0210', 'Late Night City Shuttle', 'Evening and late-night transfer within the city for dinner, events, or safe return to the hotel.', 'TRANSFER', 950.00, 35, 3, '["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=75"]'::jsonb, true, 58.2, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0212', 'Anniversary Room Setup', 'Romantic room preparation with flowers, candles, dessert plate, printed card, and evening turndown.', 'OTHER', 1900.00, 45, 2, '["https://images.unsplash.com/photo-1521783988139-89397d761dce?w=1200&q=75"]'::jsonb, true, 84.7, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    duration_minutes = EXCLUDED.duration_minutes,
    max_participants = EXCLUDED.max_participants,
    images = EXCLUDED.images,
    is_available = EXCLUDED.is_available,
    popularity_score = EXCLUDED.popularity_score;

INSERT INTO pricing_rules (
    id, name, rule_type, multiplier, start_date, end_date, min_nights, days_before_checkin, priority, is_active, created_at
) VALUES
('99999999-9999-9999-9999-999999990201', 'Літній підвищений тариф на вихідні', 'WEEKEND_SURGE', 1.1800, CURRENT_DATE - 30, CURRENT_DATE + 180, NULL, NULL, 50, true, NOW()),
('99999999-9999-9999-9999-999999990202', 'Знижка за перебування 7+ ночей', 'LONG_STAY_DISCOUNT', 0.8800, CURRENT_DATE - 30, CURRENT_DATE + 365, 7, NULL, 70, true, NOW()),
('99999999-9999-9999-9999-999999990203', 'Раннє бронювання (30 днів)', 'EARLY_BIRD', 0.9200, CURRENT_DATE - 30, CURRENT_DATE + 365, NULL, 30, 60, true, NOW()),
('99999999-9999-9999-9999-999999990204', 'Підвищений тариф останньої хвилини', 'LAST_MINUTE', 1.1200, CURRENT_DATE - 30, CURRENT_DATE + 365, NULL, 3, 80, true, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
    id, room_id, user_id, check_in_date, check_out_date, guests_count, base_total, dynamic_price_total,
    final_multiplier, pricing_snapshot, status, cancellation_reason, special_requests, loyalty_points_earned,
    loyalty_points_used, created_at, updated_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddd0201', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 90, CURRENT_DATE - 87, 2, 10200.00, 10608.00, 1.0400, '{"rules":["weekend-adjustment"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Quiet room if possible', 106, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0202', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0202', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE - 84, CURRENT_DATE - 80, 2, 14400.00, 14400.00, 1.0000, '{"rules":[],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Garden-facing room', 144, 40, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0203', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 76, CURRENT_DATE - 73, 2, 14400.00, 15120.00, 1.0500, '{"rules":["business-week"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Separate beds', 151, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0204', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0204', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE - 68, CURRENT_DATE - 64, 2, 22400.00, 23520.00, 1.0500, '{"rules":["view-premium"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'High floor', 235, 100, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0205', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0205', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE - 62, CURRENT_DATE - 59, 2, 18300.00, 18300.00, 1.0000, '{"rules":[],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Extra towels', 183, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0206', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0206', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 55, CURRENT_DATE - 50, 4, 41000.00, 38950.00, 0.9500, '{"rules":["long-stay"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Kids bedding', 389, 200, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0207', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0207', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE - 48, CURRENT_DATE - 45, 2, 31800.00, 33390.00, 1.0500, '{"rules":["suite-demand"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Invoice for company', 333, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0208', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0208', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 41, CURRENT_DATE - 38, 2, 38400.00, 39936.00, 1.0400, '{"rules":["romantic-package"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Anniversary setup', 399, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0209', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0209', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE - 35, CURRENT_DATE - 32, 3, 66000.00, 69300.00, 1.0500, '{"rules":["presidential-demand"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Private dinner', 693, 300, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0210', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0210', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE - 28, CURRENT_DATE - 25, 2, 79500.00, 83475.00, 1.0500, '{"rules":["vip-demand"],"source":"seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Airport pickup', 834, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0211', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0211', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE + 3, CURRENT_DATE + 6, 1, 9300.00, 10416.00, 1.1200, '{"rules":["last-minute"],"source":"seed"}'::jsonb, 'CONFIRMED', NULL, 'Late arrival after 22:00', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0212', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0212', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE + 12, CURRENT_DATE + 18, 2, 31200.00, 29952.00, 0.9600, '{"rules":["early-bird"],"source":"seed"}'::jsonb, 'PENDING', NULL, 'Accessible bathroom required', 0, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (
    id, booking_id, amount, currency, status, payment_method, transaction_ref, failure_reason, processed_at, created_at
) VALUES
('88888888-8888-8888-8888-888888880201', 'dddddddd-dddd-dddd-dddd-dddddddd0201', 10608.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0201', NULL, NOW() - INTERVAL '89 days', NOW()),
('88888888-8888-8888-8888-888888880202', 'dddddddd-dddd-dddd-dddd-dddddddd0202', 14400.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0202', NULL, NOW() - INTERVAL '83 days', NOW()),
('88888888-8888-8888-8888-888888880203', 'dddddddd-dddd-dddd-dddd-dddddddd0203', 15120.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0203', NULL, NOW() - INTERVAL '75 days', NOW()),
('88888888-8888-8888-8888-888888880204', 'dddddddd-dddd-dddd-dddd-dddddddd0204', 23520.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0204', NULL, NOW() - INTERVAL '67 days', NOW()),
('88888888-8888-8888-8888-888888880205', 'dddddddd-dddd-dddd-dddd-dddddddd0205', 18300.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0205', NULL, NOW() - INTERVAL '61 days', NOW()),
('88888888-8888-8888-8888-888888880206', 'dddddddd-dddd-dddd-dddd-dddddddd0206', 38950.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0206', NULL, NOW() - INTERVAL '54 days', NOW()),
('88888888-8888-8888-8888-888888880207', 'dddddddd-dddd-dddd-dddd-dddddddd0207', 33390.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0207', NULL, NOW() - INTERVAL '47 days', NOW()),
('88888888-8888-8888-8888-888888880208', 'dddddddd-dddd-dddd-dddd-dddddddd0208', 39936.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0208', NULL, NOW() - INTERVAL '40 days', NOW()),
('88888888-8888-8888-8888-888888880209', 'dddddddd-dddd-dddd-dddd-dddddddd0209', 69300.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0209', NULL, NOW() - INTERVAL '34 days', NOW()),
('88888888-8888-8888-8888-888888880210', 'dddddddd-dddd-dddd-dddd-dddddddd0210', 83475.00, 'UAH', 'COMPLETED', 'card', 'seed-pay-0210', NULL, NOW() - INTERVAL '27 days', NOW()),
('88888888-8888-8888-8888-888888880211', 'dddddddd-dddd-dddd-dddd-dddddddd0211', 10416.00, 'UAH', 'PROCESSING', 'card', 'seed-pay-0211', NULL, NULL, NOW()),
('88888888-8888-8888-8888-888888880212', 'dddddddd-dddd-dddd-dddd-dddddddd0212', 29952.00, 'UAH', 'PENDING', 'card', 'seed-pay-0212', NULL, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_orders (
    id, service_id, user_id, booking_id, appointment_datetime, quantity, total_price, status, special_requests, created_at
) VALUES
('77777777-7777-7777-7777-777777770201', 'cccccccc-cccc-cccc-cccc-cccccccc0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0201', NOW() - INTERVAL '89 days' + INTERVAL '15 hours', 1, 4600.00, 'COMPLETED', 'Medium pressure', NOW()),
('77777777-7777-7777-7777-777777770202', 'cccccccc-cccc-cccc-cccc-cccccccc0204', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0202', NOW() - INTERVAL '82 days' + INTERVAL '9 hours', 2, 2500.00, 'COMPLETED', 'No pork, extra fruit', NOW()),
('77777777-7777-7777-7777-777777770203', 'cccccccc-cccc-cccc-cccc-cccccccc0209', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0203', NOW() - INTERVAL '76 days' + INTERVAL '10 hours', 1, 2100.00, 'COMPLETED', 'Meet at arrivals gate', NOW()),
('77777777-7777-7777-7777-777777770204', 'cccccccc-cccc-cccc-cccc-cccccccc0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0204', NOW() - INTERVAL '67 days' + INTERVAL '20 hours', 2, 7600.00, 'COMPLETED', 'Gluten-free dessert', NOW()),
('77777777-7777-7777-7777-777777770205', 'cccccccc-cccc-cccc-cccc-cccccccc0206', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0205', NOW() - INTERVAL '61 days' + INTERVAL '7 hours', 1, 900.00, 'COMPLETED', 'Beginner level', NOW()),
('77777777-7777-7777-7777-777777770206', 'cccccccc-cccc-cccc-cccc-cccccccc0015', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0206', NOW() - INTERVAL '53 days' + INTERVAL '12 hours', 2, 1500.00, 'COMPLETED', 'Two children, age 6 and 9', NOW()),
('77777777-7777-7777-7777-777777770207', 'cccccccc-cccc-cccc-cccc-cccccccc0205', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0207', NOW() - INTERVAL '47 days' + INTERVAL '18 hours', 1, 1400.00, 'COMPLETED', 'Focus on mobility', NOW()),
('77777777-7777-7777-7777-777777770208', 'cccccccc-cccc-cccc-cccc-cccccccc0212', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0208', NOW() - INTERVAL '40 days' + INTERVAL '17 hours', 1, 1900.00, 'COMPLETED', 'Use white flowers', NOW()),
('77777777-7777-7777-7777-777777770209', 'cccccccc-cccc-cccc-cccc-cccccccc0208', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0209', NOW() - INTERVAL '33 days' + INTERVAL '8 hours', 3, 12600.00, 'COMPLETED', 'Mountain route with easy walking', NOW()),
('77777777-7777-7777-7777-777777770210', 'cccccccc-cccc-cccc-cccc-cccccccc0209', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0210', NOW() - INTERVAL '28 days' + INTERVAL '11 hours', 1, 2100.00, 'COMPLETED', 'Name sign at airport', NOW()),
('77777777-7777-7777-7777-777777770211', 'cccccccc-cccc-cccc-cccc-cccccccc0202', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0211', CURRENT_DATE + 4 + TIME '16:00', 1, 5200.00, 'CONFIRMED', 'Quiet room after spa', NOW()),
('77777777-7777-7777-7777-777777770212', 'cccccccc-cccc-cccc-cccc-cccccccc0207', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0212', CURRENT_DATE + 13 + TIME '10:30', 2, 3400.00, 'PENDING', 'Slow walking pace', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (
    id, room_id, user_id, booking_id, rating, comment, images, sentiment_score, is_approved, created_at
) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0201', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0201', 5, 'The room was spotless, Wi-Fi was fast, and check-in took less than two minutes. Perfect for a short city stay.', '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000&q=75"]'::jsonb, 0.9400, true, NOW() - INTERVAL '86 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0202', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0202', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0202', 4, 'Garden patio was calm and private. Breakfast delivery was on time, and the staff were friendly.', '[]'::jsonb, 0.7800, true, NOW() - INTERVAL '79 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0203', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0203', 4, 'Good twin setup for a business trip. The desk was useful and the room stayed quiet overnight.', '[]'::jsonb, 0.7300, true, NOW() - INTERVAL '72 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0204', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0204', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0204', 5, 'Skyline view was excellent. The room felt premium, and room service was fast even late at night.', '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&q=75"]'::jsonb, 0.9600, true, NOW() - INTERVAL '63 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0205', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0205', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0205', 5, 'The wellness room was calm and very comfortable. Aromatherapy and bathtub were a nice touch.', '[]'::jsonb, 0.9100, true, NOW() - INTERVAL '58 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0206', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0206', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0206', 5, 'Great family suite. The living area made evenings easier, and the kids club service helped a lot.', '["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&q=75"]'::jsonb, 0.9500, true, NOW() - INTERVAL '49 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0207', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0207', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0207', 5, 'Excellent suite for work and rest. The meeting table and espresso bar were genuinely useful.', '[]'::jsonb, 0.9000, true, NOW() - INTERVAL '44 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0208', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0208', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0208', 5, 'Perfect anniversary stay. Terrace, flowers, and turndown service were all handled beautifully.', '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=75"]'::jsonb, 0.9700, true, NOW() - INTERVAL '37 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0209', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0209', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0209', 5, 'The residence is expensive but impressive. Butler service, dinner setup, and terrace view were top level.', '["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1000&q=75"]'::jsonb, 0.9800, true, NOW() - INTERVAL '31 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0210', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0210', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0210', 5, 'Penthouse felt like a private apartment. Airport coordination and lounge area were excellent.', '[]'::jsonb, 0.9500, true, NOW() - INTERVAL '24 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (
    id, entity_type, entity_id, action, old_value, new_value, performed_by, ip_address, created_at
) VALUES
('66666666-6666-6666-6666-666666660201', 'ROOM', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0204', 'UPDATE', '{"status":"MAINTENANCE"}'::jsonb, '{"status":"AVAILABLE"}'::jsonb, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0102', '127.0.0.1', NOW() - INTERVAL '7 days'),
('66666666-6666-6666-6666-666666660202', 'BOOKING', 'dddddddd-dddd-dddd-dddd-dddddddd0211', 'CREATE', NULL, '{"status":"CONFIRMED"}'::jsonb, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0103', '127.0.0.1', NOW() - INTERVAL '2 days'),
('66666666-6666-6666-6666-666666660203', 'SERVICE_ORDER', '77777777-7777-7777-7777-777777770211', 'STATUS_CHANGE', '{"status":"PENDING"}'::jsonb, '{"status":"CONFIRMED"}'::jsonb, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0103', '127.0.0.1', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

UPDATE rooms r
SET
    avg_rating = stats.avg_rating,
    review_count = stats.review_count,
    updated_at = NOW()
FROM (
    SELECT room_id, ROUND(AVG(rating)::numeric, 2) AS avg_rating, COUNT(*)::int AS review_count
    FROM reviews
    WHERE is_approved = true
    GROUP BY room_id
) stats
WHERE r.id = stats.room_id;

