-- Catalog cleanup: remove pagination filler rooms and duplicate services.

-- Demo rooms from V5 (numbered clones like "Бізнес номер 7")
UPDATE rooms
SET deleted_at = NOW(), updated_at = NOW()
WHERE deleted_at IS NULL
  AND description LIKE 'Демо-номер для заповнення каталогу%';

-- Reassign service orders before removing duplicate catalog entries
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0201' WHERE service_id IN ('cccccccc-cccc-cccc-cccc-cccccccc0001', 'cccccccc-cccc-cccc-cccc-cccccccc0011', 'cccccccc-cccc-cccc-cccc-cccccccc0021');
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0206' WHERE service_id IN ('cccccccc-cccc-cccc-cccc-cccccccc0002', 'cccccccc-cccc-cccc-cccc-cccccccc0026');
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0203' WHERE service_id IN ('cccccccc-cccc-cccc-cccc-cccccccc0003', 'cccccccc-cccc-cccc-cccc-cccccccc0023');
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0204' WHERE service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0024';
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0205' WHERE service_id IN ('cccccccc-cccc-cccc-cccc-cccccccc0014', 'cccccccc-cccc-cccc-cccc-cccccccc0025');
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0208' WHERE service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0013';
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0207' WHERE service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0027';
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0209' WHERE service_id IN ('cccccccc-cccc-cccc-cccc-cccccccc0004', 'cccccccc-cccc-cccc-cccc-cccccccc0028');
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0210' WHERE service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0016';
UPDATE service_orders SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0202' WHERE service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0022';

UPDATE services
SET deleted_at = NOW()
WHERE id IN (
    'cccccccc-cccc-cccc-cccc-cccccccc0001',
    'cccccccc-cccc-cccc-cccc-cccccccc0002',
    'cccccccc-cccc-cccc-cccc-cccccccc0003',
    'cccccccc-cccc-cccc-cccc-cccccccc0004',
    'cccccccc-cccc-cccc-cccc-cccccccc0011',
    'cccccccc-cccc-cccc-cccc-cccccccc0013',
    'cccccccc-cccc-cccc-cccc-cccccccc0014',
    'cccccccc-cccc-cccc-cccc-cccccccc0016',
    'cccccccc-cccc-cccc-cccc-cccccccc0021',
    'cccccccc-cccc-cccc-cccc-cccccccc0022',
    'cccccccc-cccc-cccc-cccc-cccccccc0023',
    'cccccccc-cccc-cccc-cccc-cccccccc0024',
    'cccccccc-cccc-cccc-cccc-cccccccc0025',
    'cccccccc-cccc-cccc-cccc-cccccccc0026',
    'cccccccc-cccc-cccc-cccc-cccccccc0027',
    'cccccccc-cccc-cccc-cccc-cccccccc0028'
)
AND deleted_at IS NULL;
