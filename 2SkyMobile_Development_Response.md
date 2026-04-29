# 2SKY MOBILE eSIM Store — Technical Development Response

_This document serves as the completed Technical Development Brief for the eSIM Store Platform (Web + Mobile Application)._

---

## 1. COMPANY OVERVIEW

- **Company Name:** Esim souf
- **Country of Registration:** Algeria
- **Business Purpose:** Traveling to neighboring countries and finding internet.
- **Target Markets:** North African countries (Tunisia, Libya, Egypt), Turkey, Europe.
- **Target Audience:** [X] B2C Travelers | [ ] B2B Enterprise | [ ] B2B2C White-label | [ ] Other
- **Expected MAU (Year 1):** 500 users and gradually increase monthly
- **Expected Transactions / Mo:** 2000 GB and gradually increase monthly
- **Existing Infrastructure:** App (React Web App & Node.js Backend API currently in development)

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Features

- **eSIM Package Catalog:** Browse by country, region, data volume, validity. Real-time pricing.
- **User Registration & Auth:** Email/Password, Phone OTP.
- **User Personal Account:** Profile, purchase history, active eSIMs, multi-currency balance.
- **Admin Panel:** User/order management, catalog CRUD, analytics dashboard.
- **Payment Processing:** Stripe (International), CIB/Eddahabia (Local integration simulation).
- **eSIM Provisioning API:** 2Sky API (Primary).
- **Multilingual Support:** Arabic (RTL), English, French.
- **Notifications:** [X] Push | [X] Email (Resend/SendGrid) | [ ] SMS — Transactional + Marketing
- **Promo / Referral System:** Custom referral links, multi-currency rewards/commissions.
- **Blog / Content Section:** Help center and FAQ implemented.

### 2.2 Advanced Features

- **AI Customer Support:** GPT-4o integration planned for future phases.
- **Live Chat / Helpdesk:** Tawk.to or Intercom (TBD).
- **eSIM Status Tracking:** Real-time active status, data remaining, expiry tracking.
- **Data Usage Dashboard:** Visual usage tracking (Recharts), alert system.
- **Auto Top-Up:** Not required for MVP, planned for v2.
- **eSIM Installation Wizard:** Step-by-step setup with iOS/Android specific instructions.
- **User Analytics:** Custom built-in dashboard.
- **A/B Testing Engine:** Not currently planned for MVP.

---

## 3. TECHNOLOGY STACK & ARCHITECTURE

### 3.1 Recommended Stack

| Layer                  | Your Preference                                  |
| :--------------------- | :----------------------------------------------- |
| **Frontend — Web**     | React 18+ (Vite, TypeScript, Tailwind)           |
| **Frontend — Mobile**  | Flutter                                          |
| **Backend API**        | Node.js (Express, TypeScript)                    |
| **Database — Primary** | PostgreSQL 16+ (Prisma ORM)                      |
| **Database — Cache**   | Redis 7+ (sessions, rate limits, cache)          |
| **Search Engine**      | PostgreSQL Full-Text Search (Sufficient for MVP) |
| **Message Queue**      | BullMQ (Redis-based)                             |
| **File Storage**       | AWS S3 / Cloudflare R2                           |
| **CDN**                | Cloudflare                                       |
| **CI/CD**              | GitHub Actions                                   |
| **Monitoring**         | Grafana + Prometheus                             |
| **Error Tracking**     | Sentry                                           |

### 3.2 Infrastructure & Capacity

- **Cloud Provider:** [ ] AWS | [ ] GCP | [ ] Azure | [X] Hetzner | [ ] Other
- **Deployment Model:** [ ] Kubernetes | [X] Docker Compose | [ ] Serverless
- **Region Strategy:** Primary region in Europe (Germany/Finland via Hetzner) for optimal latency to North Africa.
- **Expected Peak RPS:** ~50-100 RPS (MVP scale).
- **Uptime SLA Target:** [ ] 99.9% | [X] 99.95% | [ ] 99.99%
- **Database Sizing:** 50GB for Year 1.
- **Auto-scaling Policy:** Vertical scaling initially; horizontal via load balancers if limits exceed 80%.
- **Backup & DR:** Daily automated backups to S3, 7-day retention.
- **Environments:** [X] Development | [X] Staging | [ ] UAT | [X] Production

### 3.3 Backend Architecture

- **API Architecture:** [X] REST | [ ] GraphQL | [ ] gRPC | [ ] Hybrid
- **Authentication:** [X] JWT + Refresh Tokens | [ ] OAuth 2.0 | [ ] Session-based
- **API Rate Limiting:** Global limits (100 req/min), Auth endpoints (5 req/min) per IP.
- **API Versioning:** [X] URL-based (v1/v2) | [ ] Header-based

---

## 4. INTEGRATIONS

### 4.1 eSIM Provider APIs

- **Primary eSIM Provider:** 2Sky Mobile API
- **Provisioning Flow:** [X] QR Code | [X] Direct Profile Push (LPA) | [ ] Both
- **Supported Operations:** Activate, suspend, top-up.
- **Webhook Support:** [X] Yes | [ ] No | [ ] Not sure
- **Fallback Provider:** Airalo API (Optional future redundancy).

### 4.2 Payments & Financial

- **Payment Gateway:** Stripe (International), Local Algerian Gateway.
- **Mobile Pay:** [X] Apple Pay | [X] Google Pay | [ ] Samsung Pay
- **Supported Currencies:** USD, EUR, DZD (Dynamic FX).
- **Invoice Generation:** [X] Automated | [ ] Tax calc (VAT/GST) | [ ] Not needed
- **Accounting Integration:** Custom ERP/Accounting export via CSV.
- **Anti-Fraud:** [X] 3D Secure | [ ] Velocity checks | [ ] Device fingerprint | [ ] Manual review

### 4.3 Analytics & Marketing

- **Product Analytics:** Custom built-in backend analytics.
- **CRM Integration:** Custom internal CRM.
- **Email / Push Service:** SendGrid or Resend.
- **Attribution / ASO:** Adjust (Planned for mobile).

---

## 5. UI/UX & DESIGN

- **Brand Book / Style Guide:** [ ] Yes, ready | [X] In progress | [ ] Need to create
- **Interface Style:** Minimalist, premium travel-lifestyle.
- **Reference Apps / Sites:** Airalo, Nomad, Holafly.
- **Design Approach:** [X] Unique custom | [ ] Template adaptation | [ ] Design system
- **Dark Mode:** [X] Web + Mobile | [ ] Mobile only | [ ] Not needed
- **Accessibility (WCAG):** [ ] AA required | [X] Nice to have | [ ] Not required
- **Animation Level:** [ ] Basic | [X] Moderate | [ ] Premium

---

## 6. PLATFORMS & DEPLOYMENT

- **Web Platform:** [X] Responsive SPA | [ ] SSR (Next.js) | [ ] PWA
- **Mobile Platforms:** [ ] iOS | [ ] Android | [X] Both
- **Mobile Framework:** [ ] React Native | [X] Flutter | [ ] Native (Swift+Kotlin)
- **Min OS Versions:** iOS 14+ / Android 9+
- **App Store Accounts:** [ ] Apple Developer | [ ] Google Play | [X] Need to create
- **Tablet Optimization:** [ ] Dedicated layouts | [X] Responsive scaling

---

## 7. SECURITY & COMPLIANCE

- **Data Protection:** [X] GDPR | [ ] CCPA | [ ] LGPD | [ ] POPI | [ ] Other
- **PCI DSS Level:** SAQ-A (Stripe handles card data).
- **Data Residency:** Data hosted in EU (Hetzner Germany).
- **Encryption:** [X] TLS 1.3 in transit | [X] AES-256 at rest | [ ] Custom
- **Auth Security:** [X] MFA | [ ] Biometric | [ ] Device trust | [X] Login detection
- **API Security:** [ ] OAuth 2.0 | [ ] API key rotation | [X] Webhook signatures
- **Anti-Fraud:** [X] Velocity limits | [ ] Device fingerprint | [ ] Geo-anomaly
- **Pen Testing:** [X] Before launch | [ ] Annual | [ ] Not planned
- **Certifications:** [ ] SOC 2 | [ ] ISO 27001 | [X] Not required | [ ] Planned

---

## 8. PERFORMANCE REQUIREMENTS

| Metric                     | Target                | Your Target                     |
| :------------------------- | :-------------------- | :------------------------------ |
| **Page Load Time (Web)**   | < 2 seconds (P95)     | < 1.5 seconds                   |
| **API Response Time**      | < 200ms (P95)         | < 150ms                         |
| **App Cold Start**         | < 3 seconds           | < 2.5 seconds                   |
| **Concurrent Users**       | Specify target        | 1,000+ Concurrent               |
| **eSIM Provisioning Time** | < 30 seconds e2e      | < 15 seconds (API dependent)    |
| **Availability SLA**       | 99.95%                | 99.95%                          |
| **Load Testing**           | 3x expected peak (k6) | Will be conducted before launch |

---

## 9. TIMELINE, BUDGET & DELIVERY

- **Target Launch Date:** Flexible, MVP phase currently active.
- **Budget Range (USD):** TBD based on specific final integrations.
- **Recommended Phased Delivery:**
  - **Phase 1 — MVP (Current):** Web platform, Core catalog, auth, payments, basic admin (Completed ~80%).
  - **Phase 2 — Beta:** 2Sky API integration, Referral system, Analytics dashboard.
  - **Phase 3 — Prod:** Mobile app (Flutter) release, perf tuning.
- **Development Method:** [X] Agile/Scrum | [ ] Kanban | [ ] Waterfall
- **Acceptance Criteria:** E2E successful eSIM purchase flow, fully functional dashboard.

---

## 10. POST-LAUNCH SUPPORT & SCALING

- **Support SLA:** [ ] P1: 1h | [X] P2: 4h | [ ] P3: 24h | [ ] Custom
- **Maintenance Plan:** [X] Monthly patches | [ ] Quarterly updates | [ ] On-demand
- **Monitoring:** [X] 24/7 automated | [ ] Business hours | [ ] Self-managed
- **Scaling Roadmap:** Launch in Algeria -> Expand to North Africa -> Multi-lingual global SEO scaling.
- **Code Ownership:** [X] Full source transfer | [ ] Licensed access | [ ] Managed by vendor
- **Infrastructure Ownership:** Client managed with vendor guidance.

---

## 11. ADDITIONAL INFORMATION

- **Business Model Doc:** [ ] Ready to share | [X] In preparation | [ ] Not available
- **Key Competitors:** Airalo, Nomad, Holafly.
- **Communication:** [ ] Slack | [ ] Zoom | [X] Email | [X] Telegram / WhatsApp
- **Sync Cadence:** Weekly progress updates.
- **Contact Information:**
  - \*\*Technical Contact:
  - **Business Contact:** Esim souf Owner
- **NDA Required:** [ ] Mutual NDA | [ ] One-way | [X] Not required
