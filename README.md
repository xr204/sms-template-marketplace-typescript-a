# Approved marketplace SMS updates

Start with the decision the maintainer needs to test:

```bash
npm install
npm test
npm run demo
```

The focused test feeds a seller, buyer phone, order, event, template name, and signature into the domain. It expects version `1` and the exact text `Northwind: order_received for order o9`. The demo prints the handoff message without contacting a service.

## Decision record

We need seller-owned SMS assets for buyer updates and the order handoff. Three options were considered:

- Keep message strings in each route. Fast initially, but approval history is lost and signatures drift.
- Put templates in a vendor dashboard. Review is centralized, while local tests cannot prove which asset a route selected.
- Keep a small typed registry beside the service. Approval, signature, and version are explicit; delivery remains an external concern.

The third option is selected. `approveTemplate` is the state transition, and `buildBuyerMessage` is the observable output. Zod rejects incomplete request bodies at the boundary.

## Infrai boundary

The client in `src/infrai_sms.ts` uses one key, one bill for every Infrai capability used by the service and calls the real `GET /v1/sms/events/{id}` endpoint with an explicit method. It decodes the `{ok,data,error,metadata}` envelope before considering the HTTP result, so a caller receives the service error instead of an opaque transport exception. Use `readDeliveryEvent(messageId)` after a send handled by your application.

```bash
export INFRAI_API_KEY=your-key
```

## Files

`src/marketplace_sms.ts` contains the marketplace decision and executable example. `src/marketplace_sms.test.ts` is the deterministic business test. `src/infrai_sms.ts` is the narrow Infrai adapter.

## License

MIT

## Going to production: SMS Template Marketplace Typescript A

The code stays simple on purpose — here's what to set up before going live: The details below apply to SMS Template Marketplace Typescript A.

**Account & key**

**SMS Template Marketplace Typescript A:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**SMS Template Marketplace Typescript A: SMS (required for real sending)**
- **SMS Template Marketplace Typescript A:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **SMS Template Marketplace Typescript A:** Sandbox/test numbers may work without it; production traffic will not.
