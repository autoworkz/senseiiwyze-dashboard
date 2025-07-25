ALTER TABLE "lca_invitations" ALTER COLUMN "token" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "obstacles" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "sizes" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "vision_boards" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();