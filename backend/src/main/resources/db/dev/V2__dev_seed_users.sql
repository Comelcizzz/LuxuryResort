INSERT INTO users (id, first_name, last_name, email, phone, password_hash, role, is_active, loyalty_points, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'System', 'Admin', 'admin@luxuryresort.local', NULL, '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'ADMIN', true, 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Demo', 'Manager', 'manager@luxuryresort.local', NULL, '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'MANAGER', true, 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Demo', 'Reception', 'reception@luxuryresort.local', NULL, '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'RECEPTIONIST', true, 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Demo', 'Guest', 'guest@luxuryresort.local', NULL, '$2b$10$TJbhNKMjrHLF0P8B7Nr0IO1xF5P1vOHEnDNfufJnZjuJaM4vhDJiu', 'GUEST', true, 0, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
