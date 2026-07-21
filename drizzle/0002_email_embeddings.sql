CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TABLE "email_embedding" (
	"email_id" uuid PRIMARY KEY NOT NULL,
	"model" text NOT NULL,
	"content_hash" text NOT NULL,
	"embedding" vector(768) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_embedding" ADD CONSTRAINT "email_embedding_email_id_email_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."email"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_embedding_hnsw_idx" ON "email_embedding" USING hnsw ("embedding" vector_cosine_ops);
