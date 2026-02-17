-- Fix renting offers table structure if needed
-- This script ensures technical_details is properly initialized for existing rows

UPDATE renting_offers
SET technical_details = '{}'::jsonb
WHERE technical_details IS NULL;

-- No schema change needed for KM label change as it's purely frontend display logic.
-- However, we can add a comment to document this change.

COMMENT ON COLUMN renting_offers.pricing_matrix IS 'JSONB array storing pricing options. Structure: [{"duration": int, "mileage": int (TOTAL KM), "upfront": int, "price": decimal}]';

SELECT 'Technical details initialization complete' as result;
