# QR Code Research Reference

**Date:** 2026-01-16
**Purpose:** Background research for QR generator tool improvements

---

## Original Reference Sources

### 1. QR Code Hijacking Scams (Security Alert)
**URL:** https://www.wilx.com/2026/01/13/ag-nessel-issues-consumer-alert-qr-code-hijacking-scams/

**Summary:**
Consumer alert about QR code hijacking scams. QR codes are square barcodes that can link to websites or apps, making them targets for malicious actors who replace legitimate codes with ones redirecting to phishing sites.

---

### 2. QR Code Versions (Official Documentation)
**URL:** https://www.qrcode.com/en/about/version.html

**Summary:**
Official documentation on QR code versions from Denso Wave (QR code inventors). Covers:
- Version numbers (1-40) determining size and capacity
- Each version adds 4 modules per side (Version 1 = 21×21, Version 40 = 177×177)
- Data capacity varies by version and error correction level

---

### 3. QR Code Wikipedia
**URL:** https://en.wikipedia.org/wiki/QR_code

**Summary:**
Comprehensive overview including:
- History: Invented 1994 by Denso Wave for Toyota automotive tracking
- Structure: Position patterns, timing patterns, alignment patterns, format info
- Encoding modes: Numeric, alphanumeric, byte, kanji
- Error correction: Reed-Solomon codes with 4 levels (L/M/Q/H)

---

### 4. Comprehensive QR Code Guide (Uniqode)
**URL:** https://www.uniqode.com/blog/qr-code-basics/comprehensive-guide-to-qr-code

**Summary:**
Practical guide covering:
- Static vs dynamic QR codes
- Use cases: marketing, payments, authentication
- Best practices for design and deployment
- Tracking and analytics capabilities

---

### 5. QR Code Symbology (Scandit)
**URL:** https://www.scandit.com/products/barcode-scanning/symbologies/qr-code/

**Summary:**
Technical specifications for barcode scanning:
- QR code structure and symbology
- Scanning capabilities and requirements
- Integration with scanning SDKs

---

## Research Findings

### Technical Specifications

#### Structure Components
| Component | Purpose |
|-----------|---------|
| Position Detection Patterns | 3 corners for high-speed reading and orientation |
| Timing Patterns | Synchronize scanning process |
| Alignment Patterns | Handle module displacement from distortion |
| Data Area | Encoded information + Reed-Solomon error correction |
| Quiet Zone | Minimum 4 modules margin required |

#### Versions & Capacity
- 40 versions total, starting at 21×21 modules
- Each version adds 4 modules per side
- **Max capacity (Version 40):** 7,089 numeric / ~4,296 alphanumeric / ~2,953 bytes

#### Error Correction Levels
| Level | Recovery | Use Case |
|-------|----------|----------|
| **L** | ~7% | Highest data density, smallest size |
| **M** | ~15% | Standard marketing (default) |
| **Q** | ~25% | Codes with logos/branding |
| **H** | ~30% | Max durability, largest size |

---

### QR Code Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Static** | Data embedded directly, permanent | Business cards, packaging |
| **Dynamic** | Short URL redirect, editable | Marketing campaigns, tracking |
| **vCard** | Contact details | Digital business cards |
| **WiFi** | Network credentials (SSID/password) | Guest network access |
| **URL** | Website links | Print-to-digital bridge |

---

### Design Best Practices

1. **Contrast:** Dark pattern on light background, minimum 3:1 ratio
2. **Logo Integration:** Center logo ≤30% of QR area, use error level Q or H
3. **Size:** Minimum 2×2 cm for print; 1 cm per 10 cm viewing distance
4. **Quiet Zone:** 4+ module blank margin on all sides
5. **Testing:** Test on multiple devices, OS, lighting, distances before deployment

---

### Security Risks (Quishing)

**Threat landscape in 2026:**
- 51% surge in QR phishing attacks
- ~2% of scanned QR codes are malicious
- Average breach cost: **$4.45 million USD**
- FBI warns of state-sponsored attacks (e.g., Kimsuky/APT43)

**Attack vectors:**
- Bypass email security via image-embedded QR codes
- Redirect to fake login pages (Microsoft 365, Okta, Google)
- Session token theft → MFA bypass
- 27% exploit fake MFA re-authentication alerts

---

## Additional Sources (from web search)

### Technical
- [Scanova - Error Correction](https://scanova.io) - QR code error correction settings guide
- [GS1 UK - QR Standards](https://gs1uk.org) - Industry standards for QR codes
- [Keyence - QR Structure](https://keyence.eu) - Technical breakdown of QR code structure

### Security
- [Bitdefender - Quishing Threats](https://bitdefender.com) - 2026 QR code phishing analysis
- [SecurityWeek - QR Scams](https://securityweek.com) - State-sponsored QR attacks
- [BleepingComputer - Kimsuky](https://bleepingcomputer.com) - APT43 quishing campaigns
- [TechRadar - QR Security](https://techradar.com) - Consumer QR code safety

### Design & Usage
- [QRCode Tiger](https://qrcode-tiger.com) - Types and use cases
- [Uniqode](https://uniqode.com) - Comprehensive QR guide
- [The QRCode Generator](https://the-qrcode-generator.com) - Design best practices
- [Hovercode](https://hovercode.com) - Logo integration guidelines
- [Scanova](https://scanova.io) - Design and customization tips
- [Wix](https://wix.com) - QR code creation guide
- [goqr.me](https://goqr.me) - Static vs dynamic comparison
- [Autonix](https://autonix.io) - QR code data types

### Competitor Analysis
- [QRCode Monkey](https://qrcode-monkey.com) - Popular free QR generator
  - Key strengths: High-res output, PNG/SVG/PDF/EPS formats, logo customization, color presets
  - Free, unlimited scans, no expiration
  - Premium: tracking, bulk creation, dynamic QR codes

---

## Key Takeaways for Implementation

1. **Keep `qr-code-styling` library** - Already handles Reed-Solomon encoding, styling, logo masking
2. **Use error correction level H** (30%) when logos are added - ensures scannability
3. **Enforce minimum 3:1 contrast ratio** - critical for scanning reliability
4. **Support WiFi/vCard/Email/SMS** - these are the most requested structured types
5. **Offer SVG export** - designers need vector output for print
6. **PNG at 512/1024/2048px** - covers web, general, and print use cases
