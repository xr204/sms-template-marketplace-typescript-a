import { z } from "zod";
import { smsEvents } from "./infrai_sms.js";

export const marketplaceUpdate = z.object({
  sellerId: z.string().min(1), buyerPhone: z.string().min(7), orderId: z.string().min(1),
  event: z.enum(["order_received", "order_handoff"]), templateName: z.string().min(1), signature: z.string().min(1)
});
export type MarketplaceUpdate = z.infer<typeof marketplaceUpdate>;

export type ApprovedAsset = { name: string; signature: string; body: string; version: number };
const assets = new Map<string, ApprovedAsset>();

export function approveTemplate(input: MarketplaceUpdate): ApprovedAsset {
  const parsed = marketplaceUpdate.parse(input);
  const current = assets.get(parsed.templateName);
  const asset = { name: parsed.templateName, signature: parsed.signature, body: `${parsed.event} for order {{orderId}}`, version: (current?.version ?? 0) + 1 };
  assets.set(asset.name, asset);
  return asset;
}

export function buildBuyerMessage(input: MarketplaceUpdate): { to: string; text: string; assetVersion: number } {
  const parsed = marketplaceUpdate.parse(input);
  const asset = assets.get(parsed.templateName) ?? approveTemplate(parsed);
  return { to: parsed.buyerPhone, text: `${asset.signature}: ${asset.body.replace("{{orderId}}", parsed.orderId)}`, assetVersion: asset.version };
}

export async function readDeliveryEvent(messageId: string) { return smsEvents(messageId); }

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = { sellerId: "seller-17", buyerPhone: "+15551234567", orderId: "order-2048", event: "order_handoff" as const, templateName: "marketplace.order-handoff", signature: "Northwind" };
  console.log(buildBuyerMessage(input));
}
