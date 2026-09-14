# Marketplace Setup Guide

## What is available now

Open **Settings & Workspace** in ClientFlow and scroll to **Marketplace Connections**. You can save your public Fiverr profile and primary Gig URLs. Those links are stored only under your signed-in Firebase user's private `integrations` data.

No Fiverr password, cookie, or API key is requested or stored.

## Enable direct Freelancer.com synchronization

The current frontend deliberately does not contact Freelancer.com directly. Set up a server-side integration first:

1. Create a Freelancer developer application at [developers.freelancer.com](https://developers.freelancer.com/).
2. Obtain the authorized OAuth redirect URL, client ID, client secret, scopes, and sandbox settings for your application.
3. Create a Firebase Cloud Functions or Cloud Run service. Cloud Functions is the most natural choice because this project already uses Firebase Authentication and Firestore.
4. Store the Freelancer client secret and user refresh tokens in the server's secret manager. Do not place them in `.env`, `VITE_` variables, Firestore, or source control.
5. Implement a protected connection endpoint that verifies the signed-in Firebase user, begins OAuth, and handles the callback.
6. Implement a protected sync endpoint that imports only the fields you approved (recommended: client, project, milestone, status, currency, amount, and marketplace URL).
7. Deploy the server service, set its OAuth callback URL in the Freelancer developer portal, and test with the Freelancer sandbox before production.

## Important boundaries

- Use a one-way import from Freelancer to ClientFlow for the first release. This avoids accidentally creating, changing, or cancelling marketplace work.
- Fiverr automatic order or message synchronization should only be implemented after Fiverr explicitly grants approved partner/API access. Until then, use the saved profile/Gig links and enter or import orders manually.
- The included Firestore rules already keep all user subcollections, including `integrations`, private to the signed-in owner. Publish `firestore.rules` after deploying any rules changes.
