-- Fix broken Unsplash image URLs removed from the CDN (404).
-- Twin room photo and mountain excursion photo were returning 404.

UPDATE rooms
SET
    images = replace(images::text, 'photo-1616594039964-3f4fc89b6c5d', 'photo-1595526114035-0d45ed16cfbf')::jsonb,
    updated_at = NOW()
WHERE images::text LIKE '%photo-1616594039964-3f4fc89b6c5d%';

UPDATE services
SET images = replace(images::text, 'photo-1464822759844-d150ad6d1f0d', 'photo-1506905925346-21bda4d32df4')::jsonb
WHERE images::text LIKE '%photo-1464822759844-d150ad6d1f0d%';

UPDATE services
SET images = replace(images::text, 'photo-1616594039964-3f4fc89b6c5d', 'photo-1595526114035-0d45ed16cfbf')::jsonb
WHERE images::text LIKE '%photo-1616594039964-3f4fc89b6c5d%';

UPDATE reviews
SET images = replace(images::text, 'photo-1616594039964-3f4fc89b6c5d', 'photo-1595526114035-0d45ed16cfbf')::jsonb
WHERE images::text LIKE '%photo-1616594039964-3f4fc89b6c5d%';

UPDATE reviews
SET images = replace(images::text, 'photo-1464822759844-d150ad6d1f0d', 'photo-1506905925346-21bda4d32df4')::jsonb
WHERE images::text LIKE '%photo-1464822759844-d150ad6d1f0d%';

UPDATE rooms
SET
    images = replace(images::text, 'photo-1464822759844-d150ad6d1f0d', 'photo-1506905925346-21bda4d32df4')::jsonb,
    updated_at = NOW()
WHERE images::text LIKE '%photo-1464822759844-d150ad6d1f0d%';
