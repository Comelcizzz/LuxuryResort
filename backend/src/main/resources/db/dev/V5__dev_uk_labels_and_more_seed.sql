-- Ukrainian labels for already seeded services
UPDATE services
SET
    name = 'Глибокотканинний масаж',
    description = 'Інтенсивний масаж для зняття м''язової напруги та відновлення після навантажень.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0011';

UPDATE services
SET
    name = 'Винно-сирний вечір',
    description = 'Дегустаційний вечір із сомельє та добіркою локальних сирів.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0012';

UPDATE services
SET
    name = 'Гірська екскурсія',
    description = 'Одноденна екскурсія з гідом у передгір''я з фотозупинками.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0013';

UPDATE services
SET
    name = 'Персональне тренування',
    description = 'Індивідуальне тренування з фітнес-інструктором за вашою ціллю.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0014';

UPDATE services
SET
    name = 'Дитячий клуб',
    description = 'Тематичні активності для дітей під наглядом аніматорів.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0015';

UPDATE services
SET
    name = 'Нічний шатл',
    description = 'Комфортний трансфер у межах міста у вечірній та нічний час.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0016';

-- More services for richer pagination/catalog
INSERT INTO services (
    id, name, description, category, price, duration_minutes, max_participants, images, is_available, popularity_score, created_at
) VALUES
('cccccccc-cccc-cccc-cccc-cccccccc0021','Аромамасаж','Релакс-процедура з ефірними оліями та м''якою музикою.','SPA',1700.00,60,1,'["https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1600&q=80"]'::jsonb,true,62.2,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0022','Парний SPA-ритуал','SPA-комплекс для двох із чайною церемонією.','SPA',4200.00,120,2,'["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80"]'::jsonb,true,73.1,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0023','Романтична вечеря на терасі','Вечеря з видом на місто та спеціальним меню від шефа.','DINING',3100.00,120,2,'["https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80"]'::jsonb,true,80.4,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0024','Сніданок у номер','Подача преміального сніданку в номер у зручний час.','DINING',950.00,30,2,'["https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1600&q=80"]'::jsonb,true,58.7,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0025','Силове тренування','Тренування в залі з персональним тренером.','FITNESS',1300.00,55,1,'["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"]'::jsonb,true,67.9,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0026','Йога на світанку','Групова практика на даху готелю з інструктором.','FITNESS',800.00,50,14,'["https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80"]'::jsonb,true,65.1,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0027','Екскурсія старим містом','Пішохідна екскурсія історичним центром із гідом.','EXCURSION',1200.00,150,10,'["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80"]'::jsonb,true,59.4,NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0028','Трансфер до вокзалу','Індивідуальний трансфер до/з залізничного вокзалу.','TRANSFER',700.00,25,3,'["https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80"]'::jsonb,true,52.8,NOW())
ON CONFLICT (id) DO NOTHING;

-- Extra approved reviews for public page
INSERT INTO bookings (
    id, room_id, user_id, check_in_date, check_out_date, guests_count,
    base_total, dynamic_price_total, final_multiplier, pricing_snapshot,
    status, cancellation_reason, special_requests, loyalty_points_earned, loyalty_points_used,
    created_at, updated_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddd0011','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0014','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 25,CURRENT_DATE - 22,2,11700.00,11700.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,95,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0012','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0016','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 18,CURRENT_DATE - 15,2,18600.00,19158.00,1.0300,'{}'::jsonb,'CHECKED_OUT',NULL,'Фрукти в номер',150,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0013','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 14,CURRENT_DATE - 11,2,12300.00,12792.00,1.0400,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,102,0,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (
    id, room_id, user_id, booking_id, rating, comment, images, sentiment_score, is_approved, created_at
) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0011','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0014','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0011',4,'Хороший номер для короткого відпочинку, все чисто і акуратно.','[]'::jsonb,0.7800,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0012','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0016','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0012',5,'Дуже атмосферно, сподобалася тиша та сервіс.','["https://images.unsplash.com/photo-1521783988139-89397d761dce?w=1200&q=80"]'::jsonb,0.9100,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0013','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0013',4,'Зручне розташування і нормальна ціна/якість.','[]'::jsonb,0.7400,true,NOW())
ON CONFLICT (id) DO NOTHING;
