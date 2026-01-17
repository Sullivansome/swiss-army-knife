// QR Content Types and Encoders

export type QrContentType = "url" | "text" | "wifi" | "email" | "sms" | "phone";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface QrContent {
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

// Default values for each content type
export const defaultUrlData: QrContent["url"] = { value: "" };
export const defaultTextData: QrContent["text"] = { value: "" };
export const defaultWifiData: QrContent["wifi"] = {
  ssid: "",
  password: "",
  encryption: "WPA",
  hidden: false,
};
export const defaultEmailData: QrContent["email"] = {
  address: "",
  subject: "",
  body: "",
};
export const defaultSmsData: QrContent["sms"] = {
  phone: "",
  message: "",
};
export const defaultPhoneData: QrContent["phone"] = { value: "" };

// Encoder functions
export function encodeWifi(data: QrContent["wifi"]): string {
  const hidden = data.hidden ? "H:true;" : "";
  return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};${hidden};`;
}

export function encodeEmail(data: QrContent["email"]): string {
  const params = new URLSearchParams();
  if (data.subject) params.set("subject", data.subject);
  if (data.body) params.set("body", data.body);
  const query = params.toString();
  return `mailto:${data.address}${query ? "?" + query : ""}`;
}

export function encodeSms(data: QrContent["sms"]): string {
  const query = data.message ? `?body=${encodeURIComponent(data.message)}` : "";
  return `sms:${data.phone}${query}`;
}

export function encodePhone(data: QrContent["phone"]): string {
  return `tel:${data.value}`;
}

// Get QR data string based on content type
export function getQrData(
  contentType: QrContentType,
  urlData: QrContent["url"],
  textData: QrContent["text"],
  wifiData: QrContent["wifi"],
  emailData: QrContent["email"],
  smsData: QrContent["sms"],
  phoneData: QrContent["phone"],
): string {
  switch (contentType) {
    case "url":
      return urlData.value || "https://example.com";
    case "text":
      return textData.value || "Hello World";
    case "wifi":
      return encodeWifi(wifiData);
    case "email":
      return encodeEmail(emailData);
    case "sms":
      return encodeSms(smsData);
    case "phone":
      return encodePhone(phoneData);
  }
}

// Check if download should be enabled
export function canDownload(
  contentType: QrContentType,
  urlData: QrContent["url"],
  textData: QrContent["text"],
  wifiData: QrContent["wifi"],
  emailData: QrContent["email"],
  smsData: QrContent["sms"],
  phoneData: QrContent["phone"],
): boolean {
  switch (contentType) {
    case "url":
      return !!urlData.value;
    case "text":
      return !!textData.value;
    case "wifi":
      return !!wifiData.ssid;
    case "email":
      return !!emailData.address;
    case "sms":
      return !!smsData.phone;
    case "phone":
      return !!phoneData.value;
  }
}

// Content type labels for UI
export const CONTENT_TYPES: { type: QrContentType; icon: string }[] = [
  { type: "url", icon: "link" },
  { type: "text", icon: "type" },
  { type: "wifi", icon: "wifi" },
  { type: "email", icon: "mail" },
  { type: "sms", icon: "message-square" },
  { type: "phone", icon: "phone" },
];

// Validation types and functions
export type ValidationResult = {
  valid: boolean;
  message?: string;
};

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export function validateUrl(value: string): ValidationResult {
  if (!value) {
    return { valid: false };
  }
  if (!URL_REGEX.test(value)) {
    return { valid: false, message: "enterValidUrl" };
  }
  return { valid: true };
}

export function validateEmail(address: string): ValidationResult {
  if (!address) {
    return { valid: false };
  }
  if (!EMAIL_REGEX.test(address)) {
    return { valid: false, message: "enterValidEmail" };
  }
  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false };
  }
  if (!PHONE_REGEX.test(phone)) {
    return { valid: false, message: "enterValidPhone" };
  }
  return { valid: true };
}

export function validateWifi(data: QrContent["wifi"]): ValidationResult {
  if (!data.ssid) {
    return { valid: false, message: "ssidRequired" };
  }
  if (data.encryption !== "nopass" && !data.password) {
    return { valid: false, message: "passwordRequired" };
  }
  return { valid: true };
}

export function validateText(value: string): ValidationResult {
  if (!value) {
    return { valid: false };
  }
  return { valid: true };
}
