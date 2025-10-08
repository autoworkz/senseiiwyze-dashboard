// --- small helpers to pretty-print Autumn products ---
export function findRecurringPrice(product: any, interval: "month" | "year") {
    // Price items are part of product.items [{ type: "price", interval, price }, ...]
    const item = product?.items?.find((it: any) => it.type === "price" && it.interval === interval);
    if (item && typeof item.price === "number") {
      return { amount: item.price, interval };
    }
    return null; // some products may be "Custom" or add-on only
  }
  
export function formatMoney(n: number) {
    // You can localize this; Autumn/Stripe currency is set in the dashboard.
    return `$${n}`;
  }
  
export function deriveFeatureBullets(product: any): string[] {
    const bullets: string[] = [];
  
    // Show “Up to N users” if a seats feature is present
    const seats =
      product?.items?.find(
        (it: any) =>
          (it.type === "feature" || it.type === "priced_feature") &&
          (it.feature_id === "seats" || it.feature_name === "seats")
      ) ?? null;
  
    if (seats && typeof seats.included_usage === "number" && seats.included_usage > 0) {
      bullets.push(`Up to ${seats.included_usage} users`);
    }
  
    // List a couple of other features by name (if Autumn includes them)
    const otherFeatures =
      product?.items
        ?.filter((it: any) => it.type === "feature" && it.feature_id !== "seats")
        ?.slice(0, 4) || [];
  
    for (const f of otherFeatures) {
      // If your config includes names on features, Autumn returns names on items/preview.
      const label = f.feature_name || f.feature_id || "Feature";
      if (typeof f.included_usage === "number") {
        bullets.push(`${label}: ${f.included_usage} included`);
      } else {
        bullets.push(`${label}`);
      }
    }
  
    // Fallback if nothing else detected
    if (bullets.length === 0) bullets.push("Includes core platform features");
  
    return bullets;
  }
  
// Autumn annotates each product with a scenario relative to the current customer
export function ctaLabelFromScenario(s: string | undefined) {
    switch (s) {
      case "active":
        return "Current Plan";
      case "upgrade":
        return "Upgrade";
      case "downgrade":
        return "Downgrade";
      case "cancel":
        return "Switch to Free";
      case "renew":
        return "Renew";
      case "scheduled":
        return "Scheduled";
      default:
        return "Choose Plan";
    }
  }