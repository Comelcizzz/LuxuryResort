-- Extra bookings + approved reviews for richer public reviews feed
INSERT INTO bookings (
    id, room_id, user_id, check_in_date, check_out_date, guests_count,
    base_total, dynamic_price_total, final_multiplier, pricing_snapshot,
    status, cancellation_reason, special_requests, loyalty_points_earned, loyalty_points_used,
    created_at, updated_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddd0101','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 60,CURRENT_DATE - 57,2,14700.00,14700.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,120,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0102','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 56,CURRENT_DATE - 53,3,22800.00,23500.00,1.0300,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,180,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0103','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 52,CURRENT_DATE - 50,2,6400.00,6400.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,70,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0104','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 49,CURRENT_DATE - 46,2,44700.00,44700.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,210,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0105','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 45,CURRENT_DATE - 43,2,8200.00,8400.00,1.0240,'{}'::jsonb,'CHECKED_OUT',NULL,'Потрібна тиха кімната',80,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0106','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0006','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 42,CURRENT_DATE - 39,2,26700.00,27300.00,1.0220,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,190,10,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0107','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0011','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 38,CURRENT_DATE - 35,2,16200.00,16200.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,110,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0108','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0012','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 34,CURRENT_DATE - 31,2,8850.00,8850.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,60,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0109','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0013','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 30,CURRENT_DATE - 27,3,29400.00,30000.00,1.0200,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,200,20,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0110','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0014','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 41,CURRENT_DATE - 39,2,7800.00,7800.00,1.0000,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,65,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0111','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0015','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 23,CURRENT_DATE - 20,2,55500.00,56600.00,1.0200,'{}'::jsonb,'CHECKED_OUT',NULL,'Сюрприз до річниці',250,0,NOW(),NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0112','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0016','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',CURRENT_DATE - 34,CURRENT_DATE - 31,2,18600.00,19100.00,1.0270,'{}'::jsonb,'CHECKED_OUT',NULL,NULL,150,0,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (
    id, room_id, user_id, booking_id, rating, comment, images, sentiment_score, is_approved, created_at
) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0101','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0101',5,'Ідеальний варіант для вікенду: чисто, комфортно, привітний персонал.','["https://images.unsplash.com/photo-1521783988139-89397d761dce?w=1200&q=80"]'::jsonb,0.9300,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0102','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0102',4,'Сімейний люкс просторий, дітям дуже сподобалось.','[]'::jsonb,0.7600,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0103','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0103',4,'Гарний стандартний номер, нормальна шумоізоляція.','[]'::jsonb,0.7200,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0104','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0104',5,'Преміум-рівень у всьому: сервіс, чистота, атмосфера.','["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80"]'::jsonb,0.9500,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0105','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0105',4,'Дуже зручний номер для ділової поїздки.','[]'::jsonb,0.7300,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0106','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0006','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0106',5,'Романтичний настрій і чудовий інтер’єр, все супер.','["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"]'::jsonb,0.9200,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0107','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0011','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0107',5,'Вид із вікна дійсно вау, повернемось ще.','[]'::jsonb,0.9000,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0108','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0012','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0108',4,'Тихо та затишно, хороший варіант за свою ціну.','[]'::jsonb,0.7000,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0109','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0013','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0109',5,'Люкс перевершив очікування, персонал дуже уважний.','["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80"]'::jsonb,0.9400,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0110','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0014','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0110',4,'Охайно, швидке заселення, без нарікань.','[]'::jsonb,0.6900,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0111','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0015','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0111',5,'Пентхаус топ, святкування вдалося на всі 100%.','["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80"]'::jsonb,0.9600,true,NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0112','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0016','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','dddddddd-dddd-dddd-dddd-dddddddd0112',4,'Дуже приємний персонал, сподобався сервіс у номер.','[]'::jsonb,0.7500,true,NOW())
ON CONFLICT (id) DO NOTHING;
