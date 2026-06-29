# Profile Management & SF Express Station Picker — Design Spec

## Overview

Add a personal profile management page (`/account/profile`) where users can edit their name (split into last/first), birthday, change and verify phone/email, and manage multiple saved addresses including SF Express pickup stations.

## Schema Changes

### User model (additions)
```prisma
model User {
  // existing fields...
  lastName      String?   // split from existing `name`
  firstName     String?   // split from existing `name`
  birthday      DateTime?
  phoneVerified Boolean   @default(false)
  emailVerified Boolean   @default(false)
  addresses     Address[]
}
```

Migration plan: keep `name` as computed `lastName + " " + firstName` for backward compat, or drop after migration.

### New Address model
```prisma
model Address {
  id        String   @id @default(cuid())
  userId    String
  label     String   // "屋企" / "公司" / "順豐站" / "其他"
  name      String   // recipient name
  phone     String   // recipient phone
  district  String   // "香港島" / "九龍" / "新界" / "離島"
  detail    String   // full address or SF station address
  sfCode    String?  // SF station point code, e.g. "852TAL"
  sfName    String?  // SF station name, e.g. "香港仔富嘉工廈順豐站"
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

### SF Express Station Data

Static JSON file `src/data/sf-stations.json` compiled from SF Express HK official PDF/public data (~800 stations).

```json
{
  "stations": [
    { "code": "852TAL", "name": "香港仔富嘉工廈順豐站", "district": "香港島", "area": "香港仔", "address": "香港仔大道234號富嘉工業大廈9樓6室" }
  ]
}
```

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/profile` | Get current user + addresses |
| PATCH | `/api/profile` | Update lastName, firstName, birthday |
| POST | `/api/profile/verify-phone` | Send OTP to new phone via Twilio, verify |
| POST | `/api/profile/verify-email` | Send OTP to new email via Resend, verify |
| GET | `/api/addresses` | List user's saved addresses |
| POST | `/api/addresses` | Create new address |
| PATCH | `/api/addresses/[id]` | Update address |
| DELETE | `/api/addresses/[id]` | Delete address |
| GET | `/api/sf-stations?q=旺角` | Search SF Express stations by keyword |

All protected by existing JWT session middleware.

## Profile Page (`/account/profile`)

Client component "use client".

### Section 1: Basic Info
- 姓 (lastName) — text input
- 名 (firstName) — text input
- 生日 (birthday) — date input
- Save button → PATCH `/api/profile`

### Section 2: Security
- Phone row: show number + green verified badge if verified + "更改" button
- Email row: show email + green verified badge if verified + "更改" button
- "更改" flow: modal → input new phone/email → send OTP button → OTP input → verify → update + badge

### Section 3: Saved Addresses
- List of saved addresses, each showing: label badge, address text, SF code if applicable, default badge
- Edit/Delete buttons per address
- "新增地址" button → modal:
  - Tab: "自訂地址" / "順豐站"
  - Custom address: label selector, district dropdown, detail text, recipient name, phone
  - SF station: search input → debounced call `/api/sf-stations` → result list → select → auto-fill code + name + address, user adds recipient name + phone
  - Set as default toggle

## SF Express Station Picker (shared component)

Reusable `SfStationPicker` component used in:
- Address creation modal (profile page)
- Checkout page address section

Behavior:
- Text input with 300ms debounce
- Calls `/api/sf-stations?q=xxx`
- Renders dropdown results: `[點碼] 站名 — 地區`
- On select: fills `sfCode`, `sfName`, `detail`, `district`

## Checkout Integration

Add a step before shipping form:
1. "使用已儲存地址" checkbox
2. If checked: dropdown of saved addresses (show label + summary), select auto-fills shipping fields
3. If unchecked: existing manual address form, with optional SF station picker

## Data Migration

- Existing `name` field on User: split into `lastName` / `firstName` by first space
- Existing `phone` stays; add `phoneVerified = false` for existing users
- Existing `email` stays; add `emailVerified = false` for existing users
- No existing address data to migrate
