-- Clear JWKS table to fix BetterAuth private key decryption error
-- This removes all existing encrypted keys that were encrypted with the old secret

-- Clear the jwks table (this will be regenerated automatically)
DELETE FROM ba_jwks;

-- Optional: Verify the table is empty
-- SELECT COUNT(*) FROM ba_jwks;