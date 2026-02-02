import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return new Response("Webhook Error: Missing signature or secret", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log(`Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice payment succeeded: ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice payment failed: ${invoice.id}`);
        // Could send email notification to user here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error processing webhook: ${message}`);
    return new Response(`Webhook Error: ${message}`, { status: 500 });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const userId = metadata.user_id;
  const type = metadata.type;

  if (!userId) {
    console.error("No user_id in session metadata");
    return;
  }

  console.log(`Checkout completed - Type: ${type}, User: ${userId}`);

  // Handle one-time form purchases
  if (type === "form_purchase" && metadata.form_template_id) {
    await createFormPurchase({
      userId,
      formTemplateId: metadata.form_template_id,
      amountCents: session.amount_total || 0,
      stripePaymentIntent: session.payment_intent as string,
    });
  }

  // Handle bundle purchases
  if (type === "bundle_purchase" && metadata.bundle_id) {
    await createBundlePurchase({
      userId,
      bundleId: metadata.bundle_id,
      amountCents: session.amount_total || 0,
      stripePaymentIntent: session.payment_intent as string,
    });
  }

  // Handle subscription purchases
  if (session.mode === "subscription" && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await handleSubscriptionChange(subscription, userId);
  }
}

async function createFormPurchase({
  userId,
  formTemplateId,
  amountCents,
  stripePaymentIntent,
}: {
  userId: string;
  formTemplateId: string;
  amountCents: number;
  stripePaymentIntent: string | null;
}) {
  console.log(`Creating form purchase: ${formTemplateId} for user ${userId}`);

  const { error } = await supabaseAdmin.from("form_purchases").insert({
    user_id: userId,
    form_template_id: formTemplateId,
    amount_cents: amountCents,
    stripe_payment_intent: stripePaymentIntent,
    status: "completed",
    purchased_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error creating form purchase:", error);
    throw error;
  }

  console.log(`Form purchase created successfully`);
}

async function createBundlePurchase({
  userId,
  bundleId,
  amountCents,
  stripePaymentIntent,
}: {
  userId: string;
  bundleId: string;
  amountCents: number;
  stripePaymentIntent: string | null;
}) {
  console.log(`Creating bundle purchase: ${bundleId} for user ${userId}`);

  const { error } = await supabaseAdmin.from("form_purchases").insert({
    user_id: userId,
    bundle_id: bundleId,
    amount_cents: amountCents,
    stripe_payment_intent: stripePaymentIntent,
    status: "completed",
    purchased_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error creating bundle purchase:", error);
    throw error;
  }

  console.log(`Bundle purchase created successfully`);
}

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  userId?: string
) {
  // Get user ID from subscription metadata or customer
  let resolvedUserId = userId;

  if (!resolvedUserId && subscription.metadata?.user_id) {
    resolvedUserId = subscription.metadata.user_id;
  }

  if (!resolvedUserId) {
    // Try to get user from customer email
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    );
    if (customer.deleted) {
      console.error("Customer has been deleted");
      return;
    }

    const email = customer.email;
    if (email) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .single();

      if (profile) {
        resolvedUserId = profile.user_id;
      }
    }
  }

  if (!resolvedUserId) {
    console.error("Could not resolve user for subscription");
    return;
  }

  // Determine plan from subscription items
  const priceId = subscription.items.data[0]?.price.id;
  let planId = "free";

  // Map price IDs to plan names
  const priceToPlan: Record<string, string> = {
    "price_1St4fk52lqSgjCzeAqp6QBYD": "basic",
    "price_1St4gG52lqSgjCzeOiHLvvXl": "pro",
  };

  if (priceId && priceToPlan[priceId]) {
    planId = priceToPlan[priceId];
  }

  console.log(`Updating subscription for user ${resolvedUserId}: ${planId}`);

  // Upsert subscription record
  const { error } = await supabaseAdmin.from("user_subscriptions").upsert(
    {
      user_id: resolvedUserId,
      app_id: "formulare",
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      plan_id: planId,
      status: subscription.status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,app_id",
    }
  );

  if (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }

  // Update profile subscription tier
  const tier = planId === "free" ? "free" : "premium";
  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: tier })
    .eq("user_id", resolvedUserId);

  console.log(`Subscription updated successfully`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  console.log(`Subscription deleted: ${subscriptionId}`);

  // Find user by subscription ID
  const { data: sub } = await supabaseAdmin
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();

  if (!sub) {
    console.error("Could not find subscription to delete");
    return;
  }

  // Update to canceled status
  await supabaseAdmin
    .from("user_subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  // Reset profile to free tier
  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: "free" })
    .eq("user_id", sub.user_id);

  console.log(`Subscription canceled for user ${sub.user_id}`);
}
