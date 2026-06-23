-- Rich analytics seed: occupancy trend, monthly revenue, booking statuses, service orders.
-- Uses CURRENT_DATE so charts stay populated after any restart.

UPDATE users SET loyalty_points = 0, updated_at = NOW()
WHERE id IN (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108'
);

-- ── Occupancy window: past 14 days + today + near future (different rooms/users) ──
INSERT INTO bookings (
    id, room_id, user_id, check_in_date, check_out_date, guests_count,
    base_total, dynamic_price_total, final_multiplier, pricing_snapshot,
    status, cancellation_reason, special_requests, loyalty_points_earned, loyalty_points_used,
    created_at, updated_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddd0301', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 14, CURRENT_DATE - 8,  2, 23800.00, 24752.00, 1.0400, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Тихий поверх', 247, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0302', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE - 13, CURRENT_DATE - 7,  2, 19200.00, 19200.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_OUT', NULL, NULL, 192, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0303', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 12, CURRENT_DATE - 5,  2, 53600.00, 55208.00, 1.0300, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_IN',  NULL, 'Пізнє заселення', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0304', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE - 10, CURRENT_DATE - 2,  2, 80100.00, 80100.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_IN',  NULL, 'Додаткові подушки', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0305', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0011', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE - 9,  CURRENT_DATE - 1,  2, 43200.00, 43200.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_OUT', NULL, NULL, 432, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0306', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0012', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 7,  CURRENT_DATE + 2,  2, 25200.00, 26460.00, 1.0500, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_IN',  NULL, 'Без алергенів у міні-барі', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0307', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0015', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE - 13, CURRENT_DATE - 6,  2, 129500.00, 129500.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Ювілеї', 1295, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0308', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0016', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 5,  CURRENT_DATE + 4,  2, 37200.00, 37200.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, 'Квіти в номер', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0309', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE - 4,  CURRENT_DATE + 2,  2, 23800.00, 24752.00, 1.0400, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_IN',  NULL, NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0310', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0202', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE - 3,  CURRENT_DATE + 5,  2, 28800.00, 28800.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, 'Садовий вид', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0311', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',  CURRENT_DATE - 2,  CURRENT_DATE + 6,  2, 33600.00, 35280.00, 1.0500, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0312', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0204', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 1,  CURRENT_DATE + 7,  2, 44800.00, 44800.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'PENDING',     NULL, 'Високий поверх', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0313', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0205', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE,     CURRENT_DATE + 4,  2, 24400.00, 24400.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_IN',  NULL, 'SPA-пакет', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0314', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0206', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 11, CURRENT_DATE - 4,  4, 57400.00, 57400.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_OUT', NULL, 'Дитяче ліжко', 574, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0315', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0207', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE - 8,  CURRENT_DATE - 3,  2, 53000.00, 53000.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_OUT', NULL, NULL, 530, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0316', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0212', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',  CURRENT_DATE - 10, CURRENT_DATE - 3,  2, 15600.00, 15600.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CHECKED_IN',  NULL, NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0317', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0014', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE - 6,  CURRENT_DATE + 3,  2, 35100.00, 35100.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0318', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0208', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE + 1,  CURRENT_DATE + 6,  2, 64000.00, 66560.00, 1.0400, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, 'Романтичний пакет', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0319', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0209', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE + 2,  CURRENT_DATE + 9,  3, 154000.00, 154000.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, 'Приватна вечеря', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0320', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0210', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE + 4,  CURRENT_DATE + 11, 2, 185500.00, 185500.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'PENDING',     NULL, 'VIP-трансфер', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0321', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0013', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE + 7,  CURRENT_DATE + 13, 3, 58800.00, 58800.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0322', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE + 1,  CURRENT_DATE + 5,  2, 15200.00, 15200.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'PENDING',     NULL, NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0323', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',  CURRENT_DATE + 3,  CURRENT_DATE + 10, 2, 22400.00, 22400.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CONFIRMED',  NULL, NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0324', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0011', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE + 8,  CURRENT_DATE + 14, 2, 37800.00, 37800.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'PENDING',     NULL, 'Ранній сніданок', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0325', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE + 5,  CURRENT_DATE + 8,  2, 10200.00, 10200.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CANCELLED',   'Зміна планів подорожі', NULL, 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0326', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0202', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 20, CURRENT_DATE - 17, 2, 10800.00, 10800.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'NO_SHOW',     NULL, 'Не з''явився', 0, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0327', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE + 10, CURRENT_DATE + 13, 2, 14400.00, 14400.00, 1.0000, '{"source":"analytics-seed"}'::jsonb, 'CANCELLED',   'Подвійне бронювання', NULL, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Payments for recent completed stays (occupancy seed block)
INSERT INTO payments (
    id, booking_id, amount, currency, status, payment_method, transaction_ref, failure_reason, processed_at, created_at
) VALUES
('88888888-8888-8888-8888-888888880301', 'dddddddd-dddd-dddd-dddd-dddddddd0301', 24752.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0301', NULL, NOW() - INTERVAL '13 days', NOW()),
('88888888-8888-8888-8888-888888880302', 'dddddddd-dddd-dddd-dddd-dddddddd0302', 19200.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0302', NULL, NOW() - INTERVAL '12 days', NOW()),
('88888888-8888-8888-8888-888888880303', 'dddddddd-dddd-dddd-dddd-dddddddd0303', 55208.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0303', NULL, NOW() - INTERVAL '11 days', NOW()),
('88888888-8888-8888-8888-888888880304', 'dddddddd-dddd-dddd-dddd-dddddddd0304', 80100.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0304', NULL, NOW() - INTERVAL '9 days', NOW()),
('88888888-8888-8888-8888-888888880305', 'dddddddd-dddd-dddd-dddd-dddddddd0305', 43200.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0305', NULL, NOW() - INTERVAL '8 days', NOW()),
('88888888-8888-8888-8888-888888880306', 'dddddddd-dddd-dddd-dddd-dddddddd0306', 26460.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0306', NULL, NOW() - INTERVAL '6 days', NOW()),
('88888888-8888-8888-8888-888888880307', 'dddddddd-dddd-dddd-dddd-dddddddd0307', 129500.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0307', NULL, NOW() - INTERVAL '12 days', NOW()),
('88888888-8888-8888-8888-888888880308', 'dddddddd-dddd-dddd-dddd-dddddddd0314', 57400.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0314', NULL, NOW() - INTERVAL '10 days', NOW()),
('88888888-8888-8888-8888-888888880309', 'dddddddd-dddd-dddd-dddd-dddddddd0315', 53000.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0315', NULL, NOW() - INTERVAL '7 days', NOW()),
('88888888-8888-8888-8888-888888880310', 'dddddddd-dddd-dddd-dddd-dddddddd0316', 15600.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0316', NULL, NOW() - INTERVAL '9 days', NOW()),
('88888888-8888-8888-8888-888888880311', 'dddddddd-dddd-dddd-dddd-dddddddd0309', 24752.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0309', NULL, NOW() - INTERVAL '3 days', NOW()),
('88888888-8888-8888-8888-888888880312', 'dddddddd-dddd-dddd-dddd-dddddddd0313', 24400.00, 'UAH', 'COMPLETED', 'card', 'analytics-pay-0313', NULL, NOW(), NOW()),
('88888888-8888-8888-8888-888888880313', 'dddddddd-dddd-dddd-dddd-dddddddd0318', 66560.00, 'UAH', 'PROCESSING', 'card', 'analytics-pay-0318', NULL, NULL, NOW()),
('88888888-8888-8888-8888-888888880314', 'dddddddd-dddd-dddd-dddd-dddddddd0319', 154000.00, 'UAH', 'PENDING', 'card', 'analytics-pay-0319', NULL, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- Monthly revenue spread (12 distinct months, varied amounts)
INSERT INTO bookings (
    id, room_id, user_id, check_in_date, check_out_date, guests_count,
    base_total, dynamic_price_total, final_multiplier, pricing_snapshot,
    status, cancellation_reason, special_requests, loyalty_points_earned, loyalty_points_used,
    created_at, updated_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddd0401', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 360, CURRENT_DATE - 357, 2, 10200.00, 45000.00, 1.0000, '{"month":1}'::jsonb, 'CHECKED_OUT', NULL, NULL, 450, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0402', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0202', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE - 330, CURRENT_DATE - 326, 2, 18000.00, 52000.00, 1.0000, '{"month":2}'::jsonb, 'CHECKED_OUT', NULL, NULL, 520, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0403', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 300, CURRENT_DATE - 297, 2, 14400.00, 38000.00, 1.0000, '{"month":3}'::jsonb, 'CHECKED_OUT', NULL, NULL, 380, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0404', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0204', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE - 270, CURRENT_DATE - 266, 2, 22400.00, 61000.00, 1.0000, '{"month":4}'::jsonb, 'CHECKED_OUT', NULL, NULL, 610, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0405', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0205', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE - 240, CURRENT_DATE - 237, 2, 18300.00, 72000.00, 1.0000, '{"month":5}'::jsonb, 'CHECKED_OUT', NULL, NULL, 720, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0406', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0206', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 210, CURRENT_DATE - 205, 4, 41000.00, 55000.00, 1.0000, '{"month":6}'::jsonb, 'CHECKED_OUT', NULL, NULL, 550, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0407', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0207', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', CURRENT_DATE - 180, CURRENT_DATE - 177, 2, 31800.00, 48000.00, 1.0000, '{"month":7}'::jsonb, 'CHECKED_OUT', NULL, NULL, 480, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0408', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0208', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', CURRENT_DATE - 150, CURRENT_DATE - 147, 2, 38400.00, 67000.00, 1.0000, '{"month":8}'::jsonb, 'CHECKED_OUT', NULL, NULL, 670, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0409', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0209', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', CURRENT_DATE - 120, CURRENT_DATE - 117, 3, 66000.00, 59000.00, 1.0000, '{"month":9}'::jsonb, 'CHECKED_OUT', NULL, NULL, 590, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0410', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0210', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', CURRENT_DATE - 90,  CURRENT_DATE - 87,  2, 79500.00, 81000.00, 1.0000, '{"month":10}'::jsonb, 'CHECKED_OUT', NULL, NULL, 810, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0411', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0211', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',  CURRENT_DATE - 60,  CURRENT_DATE - 57,  1, 9300.00,  74000.00, 1.0000, '{"month":11}'::jsonb, 'CHECKED_OUT', NULL, NULL, 740, 0, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0412', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0212', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', CURRENT_DATE - 45,  CURRENT_DATE - 42,  2, 15600.00, 92000.00, 1.0000, '{"month":12}'::jsonb, 'CHECKED_OUT', NULL, NULL, 920, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (
    id, booking_id, amount, currency, status, payment_method, transaction_ref, failure_reason, processed_at, created_at
) VALUES
('88888888-8888-8888-8888-888888880401', 'dddddddd-dddd-dddd-dddd-dddddddd0401', 45000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-01', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '11 months' + INTERVAL '8 days', NOW()),
('88888888-8888-8888-8888-888888880402', 'dddddddd-dddd-dddd-dddd-dddddddd0402', 52000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-02', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '10 months' + INTERVAL '12 days', NOW()),
('88888888-8888-8888-8888-888888880403', 'dddddddd-dddd-dddd-dddd-dddddddd0403', 38000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-03', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '9 months' + INTERVAL '6 days', NOW()),
('88888888-8888-8888-8888-888888880404', 'dddddddd-dddd-dddd-dddd-dddddddd0404', 61000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-04', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '8 months' + INTERVAL '15 days', NOW()),
('88888888-8888-8888-8888-888888880405', 'dddddddd-dddd-dddd-dddd-dddddddd0405', 72000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-05', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '7 months' + INTERVAL '4 days', NOW()),
('88888888-8888-8888-8888-888888880406', 'dddddddd-dddd-dddd-dddd-dddddddd0406', 55000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-06', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '6 months' + INTERVAL '20 days', NOW()),
('88888888-8888-8888-8888-888888880407', 'dddddddd-dddd-dddd-dddd-dddddddd0407', 48000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-07', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '5 months' + INTERVAL '9 days', NOW()),
('88888888-8888-8888-8888-888888880408', 'dddddddd-dddd-dddd-dddd-dddddddd0408', 67000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-08', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '4 months' + INTERVAL '11 days', NOW()),
('88888888-8888-8888-8888-888888880409', 'dddddddd-dddd-dddd-dddd-dddddddd0409', 59000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-09', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '3 months' + INTERVAL '7 days', NOW()),
('88888888-8888-8888-8888-888888880410', 'dddddddd-dddd-dddd-dddd-dddddddd0410', 81000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-10', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '2 months' + INTERVAL '14 days', NOW()),
('88888888-8888-8888-8888-888888880411', 'dddddddd-dddd-dddd-dddd-dddddddd0411', 74000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-11', NULL, date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '5 days', NOW()),
('88888888-8888-8888-8888-888888880412', 'dddddddd-dddd-dddd-dddd-dddddddd0412', 92000.00, 'UAH', 'COMPLETED', 'card', 'monthly-rev-12', NULL, date_trunc('month', CURRENT_DATE) + INTERVAL '2 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ── Service orders: many users × services × statuses ──
INSERT INTO service_orders (
    id, service_id, user_id, booking_id, appointment_datetime, quantity, total_price, status, special_requests, created_at
) VALUES
('77777777-7777-7777-7777-777777770301', 'cccccccc-cccc-cccc-cccc-cccccccc0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0309', NOW() - INTERVAL '3 days' + INTERVAL '14 hours', 1, 4600.00, 'COMPLETED', 'Середній тиск', NOW()),
('77777777-7777-7777-7777-777777770302', 'cccccccc-cccc-cccc-cccc-cccccccc0202', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0313', NOW() + INTERVAL '1 day' + INTERVAL '16 hours', 1, 5200.00, 'CONFIRMED', 'Для двох', NOW()),
('77777777-7777-7777-7777-777777770303', 'cccccccc-cccc-cccc-cccc-cccccccc0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0310', NOW() + INTERVAL '2 days' + INTERVAL '19 hours', 2, 7600.00, 'PENDING', 'Без морепродуктів', NOW()),
('77777777-7777-7777-7777-777777770304', 'cccccccc-cccc-cccc-cccc-cccccccc0204', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0304', NOW() - INTERVAL '8 days' + INTERVAL '8 hours', 2, 2500.00, 'COMPLETED', 'Без лактози', NOW()),
('77777777-7777-7777-7777-777777770305', 'cccccccc-cccc-cccc-cccc-cccccccc0205', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0317', NOW() + INTERVAL '3 days' + INTERVAL '10 hours', 1, 1400.00, 'CONFIRMED', 'Фокус на спині', NOW()),
('77777777-7777-7777-7777-777777770306', 'cccccccc-cccc-cccc-cccc-cccccccc0206', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0306', NOW() + INTERVAL '1 day' + INTERVAL '7 hours', 1, 900.00, 'IN_PROGRESS', 'Початковий рівень', NOW()),
('77777777-7777-7777-7777-777777770307', 'cccccccc-cccc-cccc-cccc-cccccccc0207', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0318', NOW() + INTERVAL '4 days' + INTERVAL '11 hours', 2, 3400.00, 'PENDING', 'Повільний темп', NOW()),
('77777777-7777-7777-7777-777777770308', 'cccccccc-cccc-cccc-cccc-cccccccc0208', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0319', NOW() + INTERVAL '5 days' + INTERVAL '8 hours', 3, 12600.00, 'CONFIRMED', 'Легкий маршрут', NOW()),
('77777777-7777-7777-7777-777777770309', 'cccccccc-cccc-cccc-cccc-cccccccc0209', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0321', NOW() + INTERVAL '8 days' + INTERVAL '6 hours', 1, 2100.00, 'PENDING', 'Табличка з іменем', NOW()),
('77777777-7777-7777-7777-777777770310', 'cccccccc-cccc-cccc-cccc-cccccccc0210', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0322', NOW() + INTERVAL '2 days' + INTERVAL '22 hours', 1, 950.00, 'CONFIRMED', NULL, NOW()),
('77777777-7777-7777-7777-777777770311', 'cccccccc-cccc-cccc-cccc-cccccccc0212', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0312', NOW() + INTERVAL '6 days' + INTERVAL '17 hours', 1, 1900.00, 'PENDING', 'Білі квіти', NOW()),
('77777777-7777-7777-7777-777777770312', 'cccccccc-cccc-cccc-cccc-cccccccc0011', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0308', NOW() + INTERVAL '2 days' + INTERVAL '15 hours', 1, 1900.00, 'CONFIRMED', 'Глибокий масаж', NOW()),
('77777777-7777-7777-7777-777777770313', 'cccccccc-cccc-cccc-cccc-cccccccc0012', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0314', NOW() - INTERVAL '9 days' + INTERVAL '20 hours', 2, 3200.00, 'COMPLETED', 'Без алкоголю', NOW()),
('77777777-7777-7777-7777-777777770314', 'cccccccc-cccc-cccc-cccc-cccccccc0013', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0315', NOW() - INTERVAL '6 days' + INTERVAL '9 hours', 4, 11200.00, 'COMPLETED', 'Фото-зупинки', NOW()),
('77777777-7777-7777-7777-777777770315', 'cccccccc-cccc-cccc-cccc-cccccccc0014', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0305', NOW() - INTERVAL '7 days' + INTERVAL '18 hours', 1, 1100.00, 'COMPLETED', 'Кардіо', NOW()),
('77777777-7777-7777-7777-777777770316', 'cccccccc-cccc-cccc-cccc-cccccccc0015', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0314', NOW() - INTERVAL '10 days' + INTERVAL '12 hours', 2, 1400.00, 'COMPLETED', 'Діти 5 і 8 років', NOW()),
('77777777-7777-7777-7777-777777770317', 'cccccccc-cccc-cccc-cccc-cccccccc0016', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0320', NOW() + INTERVAL '7 days' + INTERVAL '23 hours', 1, 900.00, 'PENDING', 'До аеропорту', NOW()),
('77777777-7777-7777-7777-777777770318', 'cccccccc-cccc-cccc-cccc-cccccccc0021', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0303', NOW() - INTERVAL '11 days' + INTERVAL '13 hours', 1, 1700.00, 'COMPLETED', 'Лаванда', NOW()),
('77777777-7777-7777-7777-777777770319', 'cccccccc-cccc-cccc-cccc-cccccccc0022', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0311', NOW() + INTERVAL '3 days' + INTERVAL '14 hours', 1, 4200.00, 'CONFIRMED', 'Чайна церемонія', NOW()),
('77777777-7777-7777-7777-777777770320', 'cccccccc-cccc-cccc-cccc-cccccccc0023', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', 'dddddddd-dddd-dddd-dddd-dddddddd0318', NOW() + INTERVAL '5 days' + INTERVAL '20 hours', 2, 6200.00, 'PENDING', 'Вегетаріанське меню', NOW()),
('77777777-7777-7777-7777-777777770321', 'cccccccc-cccc-cccc-cccc-cccccccc0024', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',  'dddddddd-dddd-dddd-dddd-dddddddd0316', NOW() - INTERVAL '9 days' + INTERVAL '9 hours', 2, 1900.00, 'COMPLETED', 'О 8:30', NOW()),
('77777777-7777-7777-7777-777777770322', 'cccccccc-cccc-cccc-cccc-cccccccc0025', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', 'dddddddd-dddd-dddd-dddd-dddddddd0301', NOW() - INTERVAL '13 days' + INTERVAL '17 hours', 1, 1300.00, 'COMPLETED', 'Силове', NOW()),
('77777777-7777-7777-7777-777777770323', 'cccccccc-cccc-cccc-cccc-cccccccc0026', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', 'dddddddd-dddd-dddd-dddd-dddddddd0302', NOW() - INTERVAL '12 days' + INTERVAL '6 hours', 1, 800.00, 'COMPLETED', NULL, NOW()),
('77777777-7777-7777-7777-777777770324', 'cccccccc-cccc-cccc-cccc-cccccccc0027', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0323', NOW() + INTERVAL '5 days' + INTERVAL '10 hours', 3, 3600.00, 'CONFIRMED', 'Українською', NOW()),
('77777777-7777-7777-7777-777777770325', 'cccccccc-cccc-cccc-cccc-cccccccc0028', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0107', 'dddddddd-dddd-dddd-dddd-dddddddd0324', NOW() + INTERVAL '10 days' + INTERVAL '8 hours', 1, 700.00, 'PENDING', 'Вокзал', NOW()),
('77777777-7777-7777-7777-777777770326', 'cccccccc-cccc-cccc-cccc-cccccccc0201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0108', NULL, NOW() + INTERVAL '12 days' + INTERVAL '15 hours', 1, 4600.00, 'PENDING', 'Без бронювання номера', NOW()),
('77777777-7777-7777-7777-777777770327', 'cccccccc-cccc-cccc-cccc-cccccccc0203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',  'dddddddd-dddd-dddd-dddd-dddddddd0323', NOW() + INTERVAL '6 days' + INTERVAL '19 hours', 1, 3800.00, 'IN_PROGRESS', 'Веган меню', NOW()),
('77777777-7777-7777-7777-777777770328', 'cccccccc-cccc-cccc-cccc-cccccccc0205', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0104', NULL, NOW() - INTERVAL '2 days' + INTERVAL '11 hours', 1, 1400.00, 'CANCELLED', 'Хворіє', NOW()),
('77777777-7777-7777-7777-777777770329', 'cccccccc-cccc-cccc-cccc-cccccccc0207', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0105', NULL, NOW() - INTERVAL '5 days' + INTERVAL '14 hours', 1, 1700.00, 'CANCELLED', 'Дощ', NOW()),
('77777777-7777-7777-7777-777777770330', 'cccccccc-cccc-cccc-cccc-cccccccc0015', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0106', 'dddddddd-dddd-dddd-dddd-dddddddd0320', NOW() + INTERVAL '9 days' + INTERVAL '13 hours', 3, 2100.00, 'CONFIRMED', 'Троє дітей', NOW())
ON CONFLICT (id) DO NOTHING;
