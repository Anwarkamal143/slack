CREATE TYPE "public"."accountType" AS ENUM('email', 'oauth');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."workspaceMemberRole" AS ENUM('admin', 'guest', 'member', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."workspacePublishStatuses" AS ENUM('draft', 'private', 'public');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"surrogate_key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userId" serial NOT NULL,
	"type" "accountType" NOT NULL,
	"provider" text NOT NULL,
	"provider_accountId" text,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "channel_members" (
	"id" serial NOT NULL,
	"userId" serial NOT NULL,
	"channelId" serial NOT NULL,
	"role" "workspaceMemberRole" DEFAULT 'member',
	"surrogate_key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "channel_members_userId_channelId_pk" PRIMARY KEY("userId","channelId")
);
--> statement-breakpoint
CREATE TABLE "channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"workSpaceId" serial NOT NULL,
	"name" text NOT NULL,
	"surrogate_key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"is_private" boolean DEFAULT true,
	"is_active" boolean DEFAULT true NOT NULL,
	"createdBy" serial NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"token_expires_at" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "reset_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"role" "role" DEFAULT 'user',
	"image" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"surrogate_key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verify_email_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"token_expires_at" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "verify_email_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "work_spaces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"userId" serial NOT NULL,
	"join_code" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"status" "workspacePublishStatuses" DEFAULT 'public' NOT NULL,
	"surrogate_key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" serial NOT NULL,
	"surrogate_key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userId" serial NOT NULL,
	"workSpaceId" serial NOT NULL,
	"role" "workspaceMemberRole" DEFAULT 'member',
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "workspace_members_workSpaceId_userId_pk" PRIMARY KEY("workSpaceId","userId")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channelId_channels_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_workSpaceId_work_spaces_id_fk" FOREIGN KEY ("workSpaceId") REFERENCES "public"."work_spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verify_email_tokens" ADD CONSTRAINT "verify_email_tokens_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_spaces" ADD CONSTRAINT "work_spaces_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workSpaceId_work_spaces_id_fk" FOREIGN KEY ("workSpaceId") REFERENCES "public"."work_spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "channel_memeber_by_channelId" ON "channel_members" USING btree ("channelId");--> statement-breakpoint
CREATE INDEX "channel_memeber_by_channelId_and_userId" ON "channel_members" USING btree ("channelId","userId");--> statement-breakpoint
CREATE INDEX "channel_memeber_by_id" ON "channel_members" USING btree ("id");--> statement-breakpoint
CREATE INDEX "channel_by_workspace_id" ON "channels" USING btree ("workSpaceId");--> statement-breakpoint
CREATE INDEX "workspace_members_by_workspace_id_user_id" ON "workspace_members" USING btree ("workSpaceId","userId");--> statement-breakpoint
CREATE INDEX "workspace_members_by_user_id" ON "workspace_members" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "workspace_members_workspace_members_by_workspace_id" ON "workspace_members" USING btree ("workSpaceId");--> statement-breakpoint
CREATE INDEX "workspace_members_by_id" ON "workspace_members" USING btree ("id");