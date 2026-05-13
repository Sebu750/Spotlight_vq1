# Firebase Security Specification

## Data Invariants
1. A subscriber must have a valid email and a creation timestamp.
2. An application must have a full name, valid email, category, and creation timestamp.
3. An inquiry must have a track, full name, valid email, and creation timestamp.
4. Emails must be valid format.
5. `createdAt` must be a server timestamp.

## The Dirty Dozen Payloads
1. **Subscriber Spoofing**: Attempt to create a subscriber with a future `createdAt`. (Denied)
2. **Subscriber Shadow field**: Attempt to create a subscriber with an `isAdmin: true` field. (Denied)
3. **Application Orphan**: Attempt to create an application without a `fullName`. (Denied)
4. **Application Privilege Escalation**: Attempt to set `status: 'accepted'` on creation. (Denied)
5. **Collection Scraping**: Attempt to list all `subscribers` as an unauthenticated user. (Denied)
6. **ID Poisoning**: Attempt to create a subscriber with an extremely long ID string. (Denied)
7. **PII Leak**: Attempt to read another user's `application` by ID. (Denied)
8. **Inquiry Tampering**: Attempt to update an existing inquiry. (Denied - Inquiries should be immutable or admin-only).
9. **Mass Subscription**: Attempt to create 100 subscribers in one batch (Rate limiting / not explicitly in rules but structural).
10. **Email Injection**: Attempt to inject non-email string into email field. (Denied)
11. **Subscriber Deletion**: Attempt to delete a subscriber record as a public user. (Denied)
12. **Status Bypass**: Attempt to update an application status without being an admin. (Denied)

## Test Runner (Draft)
```typescript
// firestore.rules.test.ts
// Tests would involve:
// - public create success for subscribers/applications/inquiries
// - public read/update/delete failure for all
// - admin read/list success
```
