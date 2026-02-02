

# Stripe Subscription Integration Plan

## Overview
Implementation of a complete Stripe payment system for subscription management, including pricing page, checkout flow, webhooks, and feature gating.

---

## Phase 1: Enable Stripe & Database Setup

### 1.1 Enable Stripe Integration
- Activate Lovable's native Stripe integration
- You will be prompted to enter your Stripe Secret Key

### 1.2 Create Database Table
Create `user_subscriptions` table with the following schema:

```text
+---------------------------+-------------------+
| Column                    | Type              |
+---------------------------+-------------------+
| id                        | UUID (PK)         |
| user_id                   | UUID (NOT NULL)   |
| stripe_customer_id        | TEXT              |
| stripe_subscription_id    | TEXT              |
| app_id                    | TEXT (NOT NULL)   |
| plan_id                   | TEXT (NOT NULL)   |
| status                    | TEXT              |
| current_period_start      | TIMESTAMPTZ       |
| current_period_end        | TIMESTAMPTZ       |
| cancel_at_period_end      | BOOLEAN           |
| created_at / updated_at   | TIMESTAMPTZ       |
+---------------------------+-------------------+
```

**RLS Policies:**
- Users can view own subscriptions
- Only service role can manage subscriptions (for webhooks)

---

## Phase 2: Edge Functions

### 2.1 `create-checkout-session` Function
Creates a Stripe Checkout session for new subscriptions.

**Input:**
- priceId, userId, userEmail, successUrl, cancelUrl

**Flow:**
1. Get or create Stripe customer
2. Create Checkout session
3. Return checkout URL

### 2.2 `create-portal-session` Function
Creates a Stripe Customer Portal session for subscription management.

**Input:**
- customerId, returnUrl

**Flow:**
1. Create portal session
2. Return portal URL

### 2.3 `stripe-webhook` Function
Handles Stripe webhook events for subscription lifecycle.

**Events handled:**
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Status changes
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_failed` - Payment issues

---

## Phase 3: Frontend Components

### 3.1 Pricing Page (`/pricing`)
```text
+-----------------------------------------------+
|        Wahlen Sie Ihren Plan                   |
|     [Monatlich] / [Jahrlich -20%]             |
+-----------------------------------------------+
|                                               |
| +----------+ +----------+ +----------+        |
| |  Free    | |  Basic   | |   Pro    |        |
| |  0 EUR   | | 9,99 EUR | | 19,99EUR |        |
| |          | | /Monat   | | /Monat   |        |
| | Features | | Features | | Features |        |
| |    ...   | |    ...   | |    ...   |        |
| | [Start]  | | [Upgrade]| | [Upgrade]|        |
| +----------+ +----------+ +----------+        |
+-----------------------------------------------+
```

**Button Logic:**
- Not logged in: "Registrieren" -> /register
- Logged in + Free: "Upgrade" -> Stripe Checkout
- Logged in + Current Plan: "Aktueller Plan" (disabled)
- Logged in + Higher Plan: "Verwalten" -> Customer Portal

### 3.2 Success Page (`/success`)
- Confetti animation
- Success message
- Navigate to dashboard button

### 3.3 Upgrade Prompt Component
Modal/card shown when users access premium features without subscription.

```text
+----------------------------------+
|      [Lock Icon]                 |
|                                  |
|      Pro-Feature                 |
|  Diese Funktion ist im          |
|  Pro-Plan verfugbar.            |
|                                  |
|    [Jetzt upgraden]             |
+----------------------------------+
```

---

## Phase 4: Hooks & Feature Gating

### 4.1 `useSubscription` Hook
```typescript
// Returns:
{
  subscription: UserSubscription | null,
  plan: 'free' | 'basic' | 'pro' | 'business',
  isPro: boolean,
  isActive: boolean,
  loading: boolean
}
```

### 4.2 Update Existing `useAuth` Hook
Integrate subscription data into the existing auth context.

---

## Phase 5: Integration & Routing

### 5.1 New Routes
- `/pricing` - Pricing page
- `/success` - Payment success page

### 5.2 Update Constants
Add pricing plans configuration to `src/lib/constants.ts`:

```text
PRICING_PLANS = [
  { id: 'free', name: 'Kostenlos', price: 0, ... },
  { id: 'basic', name: 'Basic', monthlyPrice: 9.99, yearlyPrice: 95.88, ... },
  { id: 'pro', name: 'Pro', monthlyPrice: 19.99, yearlyPrice: 191.88, ... }
]
```

### 5.3 Update Profil Page
Connect the existing upgrade button to the Stripe checkout flow.

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `supabase/functions/create-checkout-session/index.ts` |
| Create | `supabase/functions/create-portal-session/index.ts` |
| Create | `supabase/functions/stripe-webhook/index.ts` |
| Create | `src/pages/Pricing.tsx` |
| Create | `src/pages/Success.tsx` |
| Create | `src/hooks/useSubscription.ts` |
| Create | `src/components/UpgradePrompt.tsx` |
| Create | `src/components/PricingCard.tsx` |
| Modify | `src/lib/constants.ts` (add pricing plans) |
| Modify | `src/App.tsx` (add routes) |
| Modify | `src/pages/Profil.tsx` (connect checkout) |
| Modify | `supabase/config.toml` (webhook config) |
| DB Migration | Create `user_subscriptions` table |

---

## Technical Details

### Stripe Price IDs Required
You will need to create products in Stripe and provide the Price IDs:
- Monthly Basic: `price_basic_monthly`
- Yearly Basic: `price_basic_yearly`
- Monthly Pro: `price_pro_monthly`
- Yearly Pro: `price_pro_yearly`

### Webhook Endpoint
The webhook will be available at:
`https://sjyozbaezibkerqoppor.supabase.co/functions/v1/stripe-webhook`

### Security Considerations
- Webhook signature verification using `STRIPE_WEBHOOK_SECRET`
- Service role only for subscription modifications
- RLS policies prevent direct client manipulation

