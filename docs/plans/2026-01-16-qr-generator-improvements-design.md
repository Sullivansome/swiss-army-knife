# QR Generator Improvements Design

**Date:** 2026-01-16
**Status:** Ready for Implementation
**Phases:** 3 (Content Types → Export Quality → Visual Polish)

---

## Overview

Enhance the existing QR code generator tool with structured content types, better export options, and UX polish. No library changes needed — keep `qr-code-styling` (v1.9.2).

---

## Phase A: Content Types

### Goal
Add structured input modes beyond raw text: WiFi, Email, SMS, Phone.

### Content Types

| Type | Fields | QR Format |
|------|--------|-----------|
| URL | `url` | `https://...` |
| Text | `text` (textarea) | Raw text |
| WiFi | `ssid`, `password`, `encryption` (WPA/WEP/None), `hidden` | `WIFI:T:WPA;S:MyNetwork;P:password123;;` |
| Email | `address`, `subject?`, `body?` | `mailto:a@b.com?subject=...&body=...` |
| SMS | `phone`, `message?` | `sms:+1234567890?body=...` |
| Phone | `phone` | `tel:+1234567890` |

### Data Structure

```typescript
// lib/qr-content.ts

type QrContentType = 'url' | 'text' | 'wifi' | 'email' | 'sms' | 'phone';

type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

interface QrContent {
  url: { value: string };
  text: { value: string };
  wifi: {
    ssid: string;
    password: string;
    encryption: WifiEncryption;
    hidden: boolean;
  };
  email: {
    address: string;
    subject?: string;
    body?: string;
  };
  sms: {
    phone: string;
    message?: string;
  };
  phone: {
    value: string;
  };
}
```

### Encoder Functions

```typescript
function encodeWifi(data: QrContent['wifi']): string {
  const hidden = data.hidden ? 'H:true;' : '';
  return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};${hidden};`;
}

function encodeEmail(data: QrContent['email']): string {
  const params = new URLSearchParams();
  if (data.subject) params.set('subject', data.subject);
  if (data.body) params.set('body', data.body);
  const query = params.toString();
  return `mailto:${data.address}${query ? '?' + query : ''}`;
}

function encodeSms(data: QrContent['sms']): string {
  const query = data.message ? `?body=${encodeURIComponent(data.message)}` : '';
  return `sms:${data.phone}${query}`;
}

function encodePhone(data: QrContent['phone']): string {
  return `tel:${data.value}`;
}
```

### UI Pattern

- **Type Selector:** Segmented pill buttons (consistent with existing dot/corner style pickers)
- **WiFi Encryption:** Radio buttons (WPA/WPA2, WEP, None)
- **Dynamic Fields:** Each type shows its own input fields

### Component Structure

| Component | Location |
|-----------|----------|
| `ContentTypeSelector` | `components/tools/qr-generator/content-type-selector.tsx` |
| `UrlFields` | `components/tools/qr-generator/fields/url.tsx` |
| `TextFields` | `components/tools/qr-generator/fields/text.tsx` |
| `WifiFields` | `components/tools/qr-generator/fields/wifi.tsx` |
| `EmailFields` | `components/tools/qr-generator/fields/email.tsx` |
| `SmsFields` | `components/tools/qr-generator/fields/sms.tsx` |
| `PhoneFields` | `components/tools/qr-generator/fields/phone.tsx` |

### State Management

```typescript
const [contentType, setContentType] = useState<QrContentType>('url');

const [urlData, setUrlData] = useState({ value: '' });
const [textData, setTextData] = useState({ value: '' });
const [wifiData, setWifiData] = useState({
  ssid: '',
  password: '',
  encryption: 'WPA' as WifiEncryption,
  hidden: false
});
const [emailData, setEmailData] = useState({ address: '', subject: '', body: '' });
const [smsData, setSmsData] = useState({ phone: '', message: '' });
const [phoneData, setPhoneData] = useState({ value: '' });

// Compute QR data string
const qrData = useMemo(() => {
  switch (contentType) {
    case 'url':   return urlData.value || 'https://example.com';
    case 'text':  return textData.value || 'Hello World';
    case 'wifi':  return encodeWifi(wifiData);
    case 'email': return encodeEmail(emailData);
    case 'sms':   return encodeSms(smsData);
    case 'phone': return encodePhone(phoneData);
  }
}, [contentType, urlData, textData, wifiData, emailData, smsData, phoneData]);

// Download validation
const canDownload = useMemo(() => {
  switch (contentType) {
    case 'url':   return !!urlData.value;
    case 'text':  return !!textData.value;
    case 'wifi':  return !!wifiData.ssid;
    case 'email': return !!emailData.address;
    case 'sms':   return !!smsData.phone;
    case 'phone': return !!phoneData.value;
  }
}, [contentType, urlData, textData, wifiData, emailData, smsData, phoneData]);
```

### Files to Create
- `lib/qr-content.ts`
- `components/tools/qr-generator/content-type-selector.tsx`
- `components/tools/qr-generator/fields/url.tsx`
- `components/tools/qr-generator/fields/text.tsx`
- `components/tools/qr-generator/fields/wifi.tsx`
- `components/tools/qr-generator/fields/email.tsx`
- `components/tools/qr-generator/fields/sms.tsx`
- `components/tools/qr-generator/fields/phone.tsx`

### Files to Modify
- `components/tools/qr-generator/index.tsx`
- `components/tools/qr-generator/i18n/en.json`
- `components/tools/qr-generator/i18n/zh.json`

---

## Phase B: Export Quality

### Goal
Add SVG export and PNG resolution options.

### Export Formats
- **PNG:** 512px, 1024px, 2048px (fixed sizes)
- **SVG:** Vector, infinite scalability

### Data Structure

```typescript
// lib/qr.ts

export const PNG_SIZES = [512, 1024, 2048] as const;
export type PngSize = (typeof PNG_SIZES)[number];

export const EXPORT_FORMATS = ['png', 'svg'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];
```

### Download Handler

```typescript
const handleDownload = async () => {
  if (!qrCodeRef.current) return;

  if (exportFormat === 'svg') {
    qrCodeRef.current.download({
      name: QR_DOWNLOAD_NAME,
      extension: 'svg',
    });
  } else {
    // Temporarily update size for high-res export
    qrCodeRef.current.update({ width: pngSize, height: pngSize });
    await qrCodeRef.current.download({
      name: QR_DOWNLOAD_NAME,
      extension: 'png',
    });
    qrCodeRef.current.update({ width: size, height: size });
  }
};
```

### UI Pattern

Button group with format and size selectors:

```
Format:   [PNG] [SVG]
Size:     [512] [1024] [2048]  ← only visible when PNG selected
```

### Files to Modify
- `lib/qr.ts`
- `components/tools/qr-generator/index.tsx`
- `components/tools/qr-generator/i18n/en.json`
- `components/tools/qr-generator/i18n/zh.json`

---

## Phase C: Visual Polish

### Goal
Add contrast warnings, mobile sticky preview, validation hints, and fade transitions.

### C1: Contrast Warning

Warn when foreground/background contrast ratio < 3:1.

```typescript
// lib/qr.ts

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [r, g, b] = rgb.map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

export function getContrastRatio(fg: string, bg: string): number {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const MIN_CONTRAST_RATIO = 3;
```

**UI:** Inline warning below color pickers.

### C2: Mobile Sticky Preview

On mobile viewports:
- Config section scrolls normally
- Preview bar sticks to bottom with mini QR (64×64) + download button

```tsx
<div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t shadow-lg z-40">
  <div className="flex items-center gap-4 p-4 max-w-screen-sm mx-auto">
    <div className="w-16 h-16 rounded-lg border flex-shrink-0">
      {/* Mini QR preview */}
    </div>
    <Button className="flex-1">{/* Download */}</Button>
  </div>
</div>
```

### C3: Live Validation

Show validation hints after field blur:

```typescript
// lib/qr-content.ts

export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function validateUrl(value: string): ValidationResult;
export function validateEmail(address: string): ValidationResult;
export function validatePhone(phone: string): ValidationResult;
export function validateWifi(data: QrContent['wifi']): ValidationResult;
export function validateText(value: string): ValidationResult;
```

**UI:** Small red text below invalid fields, only after touched.

### C4: Preview Fade Transition

Subtle 150ms opacity fade when QR updates:

```tsx
<div className={cn(
  "transition-opacity duration-150 ease-out",
  isUpdating ? "opacity-70" : "opacity-100"
)} />
```

### Files to Create
- `components/tools/qr-generator/validation-hint.tsx`

### Files to Modify
- `lib/qr.ts`
- `lib/qr-content.ts`
- `components/tools/qr-generator/index.tsx`
- `components/tools/qr-generator/i18n/en.json`
- `components/tools/qr-generator/i18n/zh.json`

---

## i18n Labels Summary

### English (`en.json`)

```json
{
  "contentType": {
    "label": "Content Type",
    "url": "URL",
    "text": "Text",
    "wifi": "WiFi",
    "email": "Email",
    "sms": "SMS",
    "phone": "Phone"
  },
  "wifi": {
    "ssid": "Network Name",
    "ssidPlaceholder": "MyWiFi",
    "password": "Password",
    "passwordPlaceholder": "Enter password",
    "encryption": "Security",
    "wpa": "WPA/WPA2",
    "wep": "WEP",
    "none": "None",
    "hidden": "Hidden Network"
  },
  "email": {
    "address": "Email Address",
    "addressPlaceholder": "hello@example.com",
    "subject": "Subject (optional)",
    "body": "Message (optional)"
  },
  "sms": {
    "phone": "Phone Number",
    "phonePlaceholder": "+1 234 567 8900",
    "message": "Message (optional)"
  },
  "phone": {
    "number": "Phone Number",
    "placeholder": "+1 234 567 8900"
  },
  "url": {
    "placeholder": "https://example.com"
  },
  "text": {
    "placeholder": "Enter any text..."
  },
  "export": {
    "format": "Format",
    "size": "Size",
    "downloading": "Downloading..."
  },
  "contrast": {
    "warning": "Low contrast may affect scanning"
  },
  "validation": {
    "enterValidUrl": "Please enter a valid URL",
    "enterValidEmail": "Please enter a valid email address",
    "enterValidPhone": "Please enter a valid phone number",
    "ssidRequired": "Network name is required",
    "passwordRequired": "Password is required for secured networks"
  }
}
```

---

## Implementation Order

1. **Phase A** — Content Types (highest user impact)
2. **Phase B** — Export Quality (quick win after A)
3. **Phase C** — Visual Polish (refinement layer)

Each phase is independently deployable.

---

## No New Dependencies

- `qr-code-styling` handles all encoding and rendering
- Contrast calculation is pure math
- Validation is pure functions
- Animations use CSS transitions
