-- Better Auth's account model requires this nullable field; password sign-in stays disabled.
ALTER TABLE "app"."accounts" ADD COLUMN "password" text;