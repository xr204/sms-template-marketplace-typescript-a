import assert from "node:assert/strict";
import { approveTemplate, buildBuyerMessage } from "./marketplace_sms.js";

const input = { sellerId: "s1", buyerPhone: "+15550001111", orderId: "o9", event: "order_received" as const, templateName: "marketplace.received", signature: "Northwind" };
const first = approveTemplate(input);
const message = buildBuyerMessage(input);
assert.equal(first.version, 1);
assert.equal(message.text, "Northwind: order_received for order o9");
assert.equal(message.assetVersion, 1);
console.log("template approval decision: versioned asset produces signed buyer text");
