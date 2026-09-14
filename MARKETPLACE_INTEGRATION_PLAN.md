# Marketplace Integration Plan

## Decision

ClientFlow can integrate directly with **Freelancer.com** through its developer API. It should **not** attempt to automate Fiverr through browser scraping, credential collection, or unofficial APIs. Fiverr does not publish a comparable general-purpose public API for seller orders and messages; use a safe link/import workflow unless Fiverr grants this business approved partner access.

This recommendation is based on the official [Freelancer developer site](https://developers.freelancer.com/) and Fiverr's public marketplace/help documentation, including its policy against automating third-party platforms where automation is prohibited ([Fiverr policy](https://help.fiverr.com/hc/en-us/articles/49174165608593-Prohibited-services-on-Fiverr)).

## Scope

Add a Marketplace Connections area to ClientFlow where an authenticated user can:

- connect a Freelancer.com account using the provider's authorized OAuth/API flow;
- selectively import or synchronize Freelancer projects into ClientFlow projects, clients, and invoices;
- save a Fiverr profile or Gig link and record Fiverr order details manually or by importing a user-provided CSV;
- see each connection's status, latest sync time, and any error without exposing marketplace credentials in the browser.

## Architecture

The existing React/Vite/Firebase frontend must remain a presentation layer. Marketplace access tokens and API calls belong in trusted server-side code, not in `VITE_` environment variables or Firestore documents readable by the browser.

```text
ClientFlow React UI
       |
Firebase Authentication token
       v
Server-side integration service (Firebase Cloud Functions or Cloud Run)
       |                         |
Freelancer authorized API       Firestore under /users/{uid}/...
       |
Freelancer.com

Fiverr: profile/Gig URL + manual record or CSV import only
```

## Implementation Phases

### 1. Confirm provider access and data mapping

1. Register a Freelancer developer application and confirm its OAuth scopes, callback URL, rate limits, sandbox access, and permitted endpoints.
2. Decide which fields are imported: client name, project title, marketplace project ID/URL, budget/currency, status, deadline, milestone/payment information, and source.
3. Decide whether synchronization is one-way (recommended initially: marketplace to ClientFlow) or whether ClientFlow may create/update Freelancer data.
4. Obtain written Fiverr partner/API approval if true automatic Fiverr synchronization is required. Without it, retain the manual/CSV approach.

### 2. Add a secure backend

1. Create a Firebase Functions or Cloud Run service in a new `functions/` or `server/` directory.
2. Implement endpoints for `startFreelancerConnect`, OAuth callback, `syncFreelancer`, `disconnectMarketplace`, and optionally `importFiverrCsv`.
3. Verify the Firebase ID token on every endpoint and enforce that a user can operate only on their own connection.
4. Store access/refresh tokens encrypted in a server-only secret store; keep only non-sensitive connection metadata in Firestore.
5. Add audit logs, error handling, retry/backoff behavior, and a per-user synchronization limit.

### 3. Extend Firestore safely

Add user-owned documents such as:

```text
/users/{uid}/integrations/freelancer
/users/{uid}/integrations/fiverr
/users/{uid}/marketplaceImports/{importId}
```

Persist only connection status, account display name/ID when permitted, last sync details, and import mappings. Update `firestore.rules` so these documents remain accessible only to their owner. Never persist marketplace passwords or access tokens in Firestore.

### 4. Build the ClientFlow UI

1. Add an **Integrations** section to Settings.
2. Add a Freelancer connection card with Connect, Sync now, Disconnect, last-sync, and error states.
3. Add a review screen for imported records so the user can choose whether each marketplace item creates or updates a ClientFlow client/project/invoice.
4. Add a Fiverr card with profile/Gig link fields and CSV import or manual order-entry actions, clearly labelled as non-automatic.
5. Add source badges and external marketplace links in the existing client, project, and invoice views.

### 5. Test and release

1. Test OAuth success, denial, expiry/refresh, revoked access, API failures, duplicate imports, invalid CSVs, and cross-user authorization.
2. Test the Freelancer flow in its sandbox before production.
3. Run the existing production build and add backend deployment/secrets instructions to `README.md` and `.env.example` (without real secrets).
4. Release behind a feature flag or a limited beta, monitor errors, then enable it broadly.

## Proposed Deliverables

- Secure Freelancer.com connection and one-way project/milestone import.
- Marketplace connection metadata and owner-only Firestore rules.
- Settings and import-review UI.
- Fiverr profile/Gig links plus manual or CSV order import.
- Setup, deployment, and user instructions.

## Required Inputs Before Implementation

- Freelancer developer-app credentials and approved redirect URL.
- Preferred backend choice: Firebase Cloud Functions (recommended for this Firebase app) or Cloud Run.
- The exact records to sync and whether any writes back to Freelancer are needed.
- Confirmation whether Fiverr partner/API access has been granted. If not, implementation will use the compliant manual/CSV option.
