ALTER TABLE "email" DROP CONSTRAINT "email_source_id_unique";--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "memory" ALTER COLUMN "source_chat_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "chat_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
ALTER TABLE "email" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "importance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "source_message_id" text;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "email" ADD CONSTRAINT "email_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory" ADD CONSTRAINT "memory_source_message_id_message_id_fk" FOREIGN KEY ("source_message_id") REFERENCES "public"."message"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "chat_user_id_idx" ON "chat" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_user_id_updated_at_idx" ON "chat" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "chat_user_id_archived_at_idx" ON "chat" USING btree ("user_id","archived_at");--> statement-breakpoint
CREATE UNIQUE INDEX "email_user_id_source_id_uidx" ON "email" USING btree ("user_id","source_id");--> statement-breakpoint
CREATE INDEX "email_user_id_idx" ON "email" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_user_id_sent_at_idx" ON "email" USING btree ("user_id","sent_at");--> statement-breakpoint
CREATE INDEX "email_thread_id_idx" ON "email" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "memory_user_id_idx" ON "memory" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memory_user_id_updated_at_idx" ON "memory" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "memory_user_id_category_idx" ON "memory" USING btree ("user_id","category");--> statement-breakpoint
CREATE INDEX "memory_user_id_active_importance_idx" ON "memory" USING btree ("user_id","is_active","importance");--> statement-breakpoint
CREATE INDEX "message_chat_id_idx" ON "message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "message_chat_id_created_at_idx" ON "message" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("userId");