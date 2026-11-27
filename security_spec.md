# Security Specification — kotobatuah.com

## 1. Data Invariants
1. **PII Isolation on Leads**: Documents in `/leads/{leadId}` contain client PII (`email`, `whatsapp`, `fullName`). Public visitors can only `create` a new lead with `status == "baru"` and server-enforced timestamps (`createdAt == request.time`, `updatedAt == request.time`). Reading (`get`, `list`), updating, or deleting leads is strictly limited to verified admins.
2. **CMS Content Integrity**: Only verified admins can create, update, or delete documents in `/portfolio/{itemId}`, `/testimonials/{testimonialId}`, and `/hostingPartners/{partnerId}`. Public visitors may only `get` or `list` documents where `published == true`.
3. **Immutable Audit & Creation Fields**: `createdAt` is immutable after creation across all collections.
4. **Strict Schema & Size Bounds**: Every document enforces exact key allowlists (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly()` on update), enum constraints, string length caps, and document ID format validation (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
5. **Terminal State Locking on Leads**: Once a lead reaches `status == "selesai"`, updates are locked unless performed by an admin override, and non-admins can never update leads at all.
6. **No Self-Assigned Admin Roles**: Clients cannot write to `/admins/{adminId}` to elevate their own privileges.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Lead Create**: Submitting `/leads/lead-1` with `{ ..., isAdmin: true, verified: true }` -> MUST return `PERMISSION_DENIED`.
2. **Status Shortcutting on Lead Create**: Submitting `/leads/lead-2` with `status: "selesai"` instead of `"baru"` -> MUST return `PERMISSION_DENIED`.
3. **Client Timestamp Forgery on Lead Create**: Submitting `/leads/lead-3` with `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time` -> MUST return `PERMISSION_DENIED`.
4. **PII Scraping (`list` leads as unauthenticated or non-admin user)**: Querying `leads` without verified admin privileges -> MUST return `PERMISSION_DENIED`.
5. **PII Read (`get` single lead as non-admin user)**: Reading `/leads/lead-1` as non-admin -> MUST return `PERMISSION_DENIED`.
6. **Email Spoofing Attack**: Authenticating with unverified token (`email_verified: false`) claiming admin email -> MUST return `PERMISSION_DENIED`.
7. **Unpublished Portfolio Scraping**: Listing `/portfolio` with `published == false` as a public user -> MUST return `PERMISSION_DENIED`.
8. **ID Poisoning**: Creating `/leads/` with a 500-character ID or special characters `../admin` -> MUST return `PERMISSION_DENIED`.
9. **Resource Exhaustion (1MB String in Lead Brief)**: Creating `/leads/lead-4` with `brief` > 1000 chars -> MUST return `PERMISSION_DENIED`.
10. **Non-Admin CMS Portfolio Write**: Creating/updating `/portfolio/p1` as a signed-in non-admin user -> MUST return `PERMISSION_DENIED`.
11. **Privilege Escalation on `/admins/{uid}`**: Signed-in non-admin attempting to write `/admins/<their-uid>` -> MUST return `PERMISSION_DENIED`.
12. **Array Unbounded Injection on `/hostingPartners/{id}`**: Admin or attacker submitting `features` array with > 6 elements or non-string first element -> MUST return `PERMISSION_DENIED`.
