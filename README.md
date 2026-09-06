# ClientFlow — Enterprise Client & Invoice Management System

[![Deploy ClientFlow to GitHub Pages](https://github.com/kpns1357-dev/freelancing/actions/workflows/deploy.yml/badge.svg)](https://github.com/kpns1357-dev/freelancing/actions/workflows/deploy.yml)

ClientFlow is a precision client and invoice management web application tailored for freelancers, boutique agencies, and independent consultancies. Built on Google Stitch's *Precision Ledger* design system, ClientFlow pairs a high-density, executive-grade UI with a real-time, multi-tenant Firebase backend.

---

## Features

- **Executive Dashboard**: Real-time KPI cards (Total Clients, Active Projects, Realized Revenue YTD, Pending Invoices), custom dynamic SVG Cash Flow chart, priority invoice action queue, and live activity stream.
- **Clients CRM**: Full CRUD lifecycle, status filters (*Active*, *Onboarding*, *Archived*), search, 4-tab interactive drawer (Overview, Projects, Invoices, Notes) with inline validation and active project protection.
- **Projects Tracker**: Kanban / Table views, deadline urgency indicators (Overdue, Due Soon, On Track), deliverable progress bars, and linked client associations.
- **Invoicing & Ledger**: Dynamic line items, automated subtotal/tax/discount math, auto-incrementing serial invoice numbering (`#INV-2024-XXX`), status tracking (`Paid`, `Pending`, `Overdue`, `Draft`), and quick mark-paid reconciliation.
- **Print-Ready Invoice Preview**: Pixel-perfect printable A4 invoice sheet with agency branding, client remittance details, banking coordinates, instant QR payment code, and direct print/PDF export.
- **Multi-Tenant Firebase Backend**:
  - **Firebase Authentication**: Secure Email & Password accounts with per-user session management.
  - **Cloud Firestore**: Real-time bidirectional subscriptions (`onSnapshot`), instant updates across devices.
  - **Strict Server-Side Data Isolation**: Enforced via `firestore.rules` where each user's data is isolated under `/users/{uid}/*`.
- **Executive Dark Mode**: Handcrafted deep slate palette (`#0B0F19`) with high-contrast glowing accents and persistent cloud preference sync.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ClientFlow Frontend                      │
│     React 18 + Vite + TypeScript + Tailwind CSS (Stitch)    │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
       Firebase Authentication         Cloud Firestore
       - Email / Password              - Real-time listeners (onSnapshot)
       - Session persistence           - Path: /users/{userId}/*
       - User profile name             - Clients, Projects, Invoices, Activities
                │                             │
                └──────────────┬──────────────┘
                               │
                      firestore.rules
             (Enforces request.auth.uid == userId)
```

---

## Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9+

### 2. Clone the Repository
```bash
git clone https://github.com/kpns1357-dev/freelancing.git
cd freelancing
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Firebase project configuration keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## Firebase Setup Guide

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it (e.g., `clientflow-app`).
3. (Optional) Disable Google Analytics for simplicity.

### 2. Enable Authentication
1. In the Firebase console sidebar, navigate to **Build** → **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, enable **Email/Password** (Email link optional: disabled).

### 3. Enable Cloud Firestore
1. Navigate to **Build** → **Firestore Database**.
2. Click **Create database**.
3. Select a location closest to your users.
4. Choose **Start in production mode**.

### 4. Deploy Security Rules
Copy the contents of `firestore.rules` from this repository into the **Firestore Database** → **Rules** tab and click **Publish**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      match /{allSubcollections=**} {
        allow read, write: if isOwner(userId);
      }
    }
    match /{document=**} {
      allow read, write: false;
    }
  }
}
```

### 5. Register Web App & Retrieve Config
1. In Project Overview, click the **Web icon (`</>`)** to add an app.
2. Enter an App nickname (e.g., `ClientFlow Web`).
3. Copy the `firebaseConfig` properties into your `.env` file.

---

## Automated Deployment (GitHub Pages & Actions)

This repository includes a fully automated CI/CD workflow (`.github/workflows/deploy.yml`) that builds and deploys ClientFlow to GitHub Pages on every push to `main`.

### Repository Secrets Configuration
In your GitHub repository, navigate to **Settings** → **Secrets and variables** → **Actions** and add the following repository secrets:

| Secret Name | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

### Enabling GitHub Pages
1. Go to **Settings** → **Pages** in your GitHub repository.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push to `main` branch to trigger your live build!

---

## Security & Isolation Guarantee

- **Zero Client-Side Secret Leakage**: Firebase API keys in Vite client applications only identify the Firebase project. Actual data access and permissions are strictly enforced by Firebase Authentication tokens verified by `firestore.rules` on Google's servers.
- **Per-User Silos**: All client records, projects, invoices, and preferences are stored exclusively under the authenticated user's UID:
  ```
  /users/{auth.uid}/clients/*
  /users/{auth.uid}/projects/*
  /users/{auth.uid}/invoices/*
  /users/{auth.uid}/activities/*
  ```
- Any unauthorized access attempt by another user is rejected server-side with `PERMISSION_DENIED`.

---

## License

MIT License © 2026 ClientFlow.
