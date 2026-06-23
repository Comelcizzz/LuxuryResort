INSERT INTO rooms (
    id,
    name,
    description,
    base_price_per_night,
    room_type,
    max_occupancy,
    size_sqm,
    floor,
    room_number,
    status,
    amenities,
    images,
    avg_rating,
    review_count,
    created_at,
    updated_at
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0011','Skyline Deluxe','Номер із видом на місто та lounge-зоною.',5400.00,'DELUXE',2,36.0,7,'702','AVAILABLE','["Wi-Fi","Smart TV","Mini-bar","Lounge chair"]'::jsonb,'["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80"]'::jsonb,4.8,9,NOW(),NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0012','Garden Standard','Тихий стандарт із видом на сад.',2950.00,'STANDARD',2,23.0,1,'115','AVAILABLE','["Wi-Fi","Shower","Desk"]'::jsonb,'["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80"]'::jsonb,4.5,6,NOW(),NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0013','Executive Suite','Люкс із окремою вітальнею та панорамними вікнами.',9800.00,'SUITE',3,71.0,9,'904','AVAILABLE','["Wi-Fi","Smart TV","Bathtub","Coffee machine"]'::jsonb,'["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=80"]'::jsonb,4.9,13,NOW(),NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0014','Twin Comfort','Комфортний номер з twin-ліжками для друзів або колег.',3900.00,'STANDARD',2,27.0,3,'312','AVAILABLE','["Wi-Fi","Twin beds","Desk","Smart TV"]'::jsonb,'["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600&q=80"]'::jsonb,4.6,7,NOW(),NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0015','Penthouse Signature','Пентхаус із терасою, джакузі та приватною dining-зоною.',18500.00,'PRESIDENTIAL',4,120.0,10,'1001','AVAILABLE','["Wi-Fi","Jacuzzi","Private terrace","Butler service","Nespresso"]'::jsonb,'["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1600&q=80"]'::jsonb,5.0,5,NOW(),NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0016','Romantic Deluxe','Затишний номер для пар із вечірнім ambient-світлом.',6200.00,'DELUXE',2,38.0,6,'611','AVAILABLE','["Wi-Fi","King bed","Smart TV","Mini-bar"]'::jsonb,'["https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1600&q=80"]'::jsonb,4.8,10,NOW(),NOW())
ON CONFLICT (room_number) DO NOTHING;

INSERT INTO services (
    id,
    name,
    description,
    category,
    price,
    duration_minutes,
    max_participants,
    images,
    is_available,
    popularity_score,
    created_at
) VALUES
('cccccccc-cccc-cccc-cccc-cccccccc0011','Deep Tissue Massage','Інтенсивний масаж для зняття м''язової напруги.','SPA',1900.00,60,1,'["https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1600&q=80"]'::jsonb,true,74.3,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0012','Wine & Cheese Evening','Дегустаційний вечір із сомельє та добіркою сирів.','DINING',1600.00,90,6,'["https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1600&q=80"]'::jsonb,true,69.8,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0013','Mountain Excursion','Одноденна екскурсія з гідом у передгір''я.','EXCURSION',2800.00,360,8,'["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"]'::jsonb,true,71.4,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0014','Personal Trainer Session','Індивідуальне тренування з фітнес-інструктором.','FITNESS',1100.00,50,1,'["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80"]'::jsonb,true,66.2,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0015','Дитячий клуб','Тематичні активності для дітей під наглядом аніматорів.','OTHER',700.00,120,12,'["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80"]'::jsonb,true,61.9,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0016','Late Night Shuttle','Нічний трансфер у межах міста.','TRANSFER',900.00,30,3,'["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"]'::jsonb,true,54.7,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
    id,
    room_id,
    user_id,
    check_in_date,
    check_out_date,
    guests_count,
    base_total,
    dynamic_price_total,
    final_multiplier,
    pricing_snapshot,
    status,
    cancellation_reason,
    special_requests,
    loyalty_points_earned,
    loyalty_points_used,
    created_at,
    updated_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddd0001','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 20,CURRENT_DATE - 17,2,14700.00,15200.00,1.0340,'{}'::jsonb,'CHECKED_OUT',NULL,'Пізній checkout',120,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 12,CURRENT_DATE - 9,3,22800.00,22800.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,180,20,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0013','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 8,CURRENT_DATE - 6,2,19600.00,20580.00,1.0500,'{}'::jsonb,'CHECKED_OUT',NULL,'Квіткова композиція',160,0,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (
    id,
    room_id,
    user_id,
    booking_id,
    rating,
    comment,
    images,
    sentiment_score,
    is_approved,
    created_at
) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0001','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0001',5,'Дуже чисто, зручне ліжко та класний краєвид. Персонал супер.','["https://images.unsplash.com/photo-1521783988139-89397d761dce?w=1200&q=80"]'::jsonb,0.9300,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0002',4,'Гарний сімейний номер, сніданки на рівні. Трохи шумно ввечері.','[]'::jsonb,0.7100,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0013','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0003',5,'Один із найкращих номерів, де ми зупинялися.','[]'::jsonb,0.9600,true,NOW())
ON CONFLICT (id) DO NOTHING;
