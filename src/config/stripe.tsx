import { loadStripe } from "@stripe/stripe-js";

// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_your_publishable_key_here";

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn(
    "VITE_STRIPE_PUBLISHABLE_KEY is missing. Using placeholder key."
  );
}

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Stripe configuration
export const stripeConfig = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  appearance: {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#2563eb",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#dc2626",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  },
  loader: "auto" as const,
};
