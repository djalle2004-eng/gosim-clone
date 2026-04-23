-- CreateEnum
CREATE TYPE "TenantPlan" AS ENUM ('FREE', 'STARTER', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "WalletTxType" AS ENUM ('TOPUP', 'PURCHASE', 'REFUND', 'COMMISSION', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING');

-- CreateTable: Tenant
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "logoUrl" TEXT,
    "primaryColor" TEXT DEFAULT '#0ea5e9',
    "secondaryColor" TEXT DEFAULT '#8b5cf6',
    "plan" "TenantPlan" NOT NULL DEFAULT 'FREE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PromoCode
CREATE TABLE "promo_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minOrderAmount" DOUBLE PRECISION,
    "maxUses" INTEGER,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "applicablePlanIds" JSONB,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ReferralCode
CREATE TABLE "referral_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "maxUsage" INTEGER,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Referral
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referralCodeId" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "orderId" TEXT,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Wallet
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'DZD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable: WalletTransaction
CREATE TABLE "wallet_transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "WalletTxType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Subscription
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planTier" "TenantPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "stripeSubscriptionId" TEXT,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ApiKey
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "prefix" VARCHAR(8) NOT NULL,
    "scopes" JSONB NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable: WebhookEndpoint
CREATE TABLE "webhook_endpoints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" JSONB NOT NULL,
    "secret" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable: TicketReply
CREATE TABLE "ticket_replies" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isStaffReply" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_replies_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Add tenantId to users
ALTER TABLE "users" ADD COLUMN "tenantId" TEXT;

-- AlterTable: Add tenantId to esim_plans
ALTER TABLE "esim_plans" ADD COLUMN "tenantId" TEXT;

-- AlterTable: Add promoCodeId to orders
ALTER TABLE "orders" ADD COLUMN "promoCodeId" TEXT;

-- CreateUniqueIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");
CREATE UNIQUE INDEX "referral_codes_code_key" ON "referral_codes"("code");
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "api_keys"("keyHash");

-- CreateIndex
CREATE INDEX "tenants_slug_idx" ON "tenants"("slug");
CREATE INDEX "tenants_plan_idx" ON "tenants"("plan");
CREATE INDEX "promo_codes_code_idx" ON "promo_codes"("code");
CREATE INDEX "promo_codes_isActive_idx" ON "promo_codes"("isActive");
CREATE INDEX "referral_codes_ownerId_idx" ON "referral_codes"("ownerId");
CREATE INDEX "referral_codes_code_idx" ON "referral_codes"("code");
CREATE INDEX "referrals_referralCodeId_idx" ON "referrals"("referralCodeId");
CREATE INDEX "referrals_referrerId_idx" ON "referrals"("referrerId");
CREATE INDEX "referrals_referredUserId_idx" ON "referrals"("referredUserId");
CREATE INDEX "referrals_orderId_idx" ON "referrals"("orderId");
CREATE INDEX "wallet_transactions_walletId_idx" ON "wallet_transactions"("walletId");
CREATE INDEX "wallet_transactions_type_idx" ON "wallet_transactions"("type");
CREATE INDEX "wallet_transactions_createdAt_idx" ON "wallet_transactions"("createdAt");
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");
CREATE INDEX "subscriptions_planTier_idx" ON "subscriptions"("planTier");
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");
CREATE INDEX "api_keys_keyHash_idx" ON "api_keys"("keyHash");
CREATE INDEX "webhook_endpoints_userId_idx" ON "webhook_endpoints"("userId");
CREATE INDEX "ticket_replies_ticketId_idx" ON "ticket_replies"("ticketId");
CREATE INDEX "ticket_replies_userId_idx" ON "ticket_replies"("userId");
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");
CREATE INDEX "esim_plans_tenantId_idx" ON "esim_plans"("tenantId");
CREATE INDEX "orders_promoCodeId_idx" ON "orders"("promoCodeId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "esim_plans" ADD CONSTRAINT "esim_plans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "promo_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "referral_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
