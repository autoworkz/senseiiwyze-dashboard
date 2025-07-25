ALTER TABLE "categories" ALTER COLUMN "id" SET MAXVALUE 9223372036854776000;--> statement-breakpoint
ALTER TABLE "lca_invitations" ALTER COLUMN "token" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "id" SET MAXVALUE 9223372036854776000;--> statement-breakpoint
ALTER TABLE "vendor_ratings" ALTER COLUMN "id" SET MAXVALUE 9223372036854776000;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET MAXVALUE 9223372036854776000;