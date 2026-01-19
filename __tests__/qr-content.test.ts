import {
  canDownload,
  defaultEmailData,
  defaultPhoneData,
  defaultSmsData,
  defaultTextData,
  defaultUrlData,
  defaultWifiData,
  encodeEmail,
  encodePhone,
  encodeSms,
  encodeWifi,
  getQrData,
  validateEmail,
  validatePhone,
  validateText,
  validateUrl,
  validateWifi,
} from "@/lib/qr-content";

describe("QR Content Encoders", () => {
  describe("encodeWifi", () => {
    it("encodes WPA network correctly", () => {
      const result = encodeWifi({
        ssid: "MyNetwork",
        password: "secret123",
        encryption: "WPA",
        hidden: false,
      });
      expect(result).toBe("WIFI:T:WPA;S:MyNetwork;P:secret123;;");
    });

    it("encodes WEP network correctly", () => {
      const result = encodeWifi({
        ssid: "OldNetwork",
        password: "wepkey",
        encryption: "WEP",
        hidden: false,
      });
      expect(result).toBe("WIFI:T:WEP;S:OldNetwork;P:wepkey;;");
    });

    it("encodes open network correctly", () => {
      const result = encodeWifi({
        ssid: "FreeWifi",
        password: "",
        encryption: "nopass",
        hidden: false,
      });
      expect(result).toBe("WIFI:T:nopass;S:FreeWifi;P:;;");
    });

    it("includes hidden flag when true", () => {
      const result = encodeWifi({
        ssid: "HiddenNetwork",
        password: "pass",
        encryption: "WPA",
        hidden: true,
      });
      expect(result).toBe("WIFI:T:WPA;S:HiddenNetwork;P:pass;H:true;;");
    });
  });

  describe("encodeEmail", () => {
    it("encodes email address only", () => {
      const result = encodeEmail({ address: "test@example.com" });
      expect(result).toBe("mailto:test@example.com");
    });

    it("encodes email with subject", () => {
      const result = encodeEmail({
        address: "test@example.com",
        subject: "Hello",
      });
      expect(result).toBe("mailto:test@example.com?subject=Hello");
    });

    it("encodes email with subject and body", () => {
      const result = encodeEmail({
        address: "test@example.com",
        subject: "Hello",
        body: "How are you?",
      });
      expect(result).toBe(
        "mailto:test@example.com?subject=Hello&body=How+are+you%3F",
      );
    });
  });

  describe("encodeSms", () => {
    it("encodes phone number only", () => {
      const result = encodeSms({ phone: "+1234567890" });
      expect(result).toBe("sms:+1234567890");
    });

    it("encodes phone with message", () => {
      const result = encodeSms({
        phone: "+1234567890",
        message: "Hello there!",
      });
      expect(result).toBe("sms:+1234567890?body=Hello%20there!");
    });
  });

  describe("encodePhone", () => {
    it("encodes phone number with tel: prefix", () => {
      const result = encodePhone({ value: "+1234567890" });
      expect(result).toBe("tel:+1234567890");
    });
  });
});

describe("getQrData", () => {
  it("returns URL value or default", () => {
    const result = getQrData(
      "url",
      { value: "https://test.com" },
      defaultTextData,
      defaultWifiData,
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe("https://test.com");
  });

  it("returns default URL when empty", () => {
    const result = getQrData(
      "url",
      { value: "" },
      defaultTextData,
      defaultWifiData,
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe("https://example.com");
  });

  it("returns text value or default", () => {
    const result = getQrData(
      "text",
      defaultUrlData,
      { value: "Custom text" },
      defaultWifiData,
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe("Custom text");
  });

  it("returns encoded WiFi data", () => {
    const result = getQrData(
      "wifi",
      defaultUrlData,
      defaultTextData,
      { ssid: "Test", password: "pass", encryption: "WPA", hidden: false },
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe("WIFI:T:WPA;S:Test;P:pass;;");
  });
});

describe("canDownload", () => {
  it("returns true when URL has value", () => {
    const result = canDownload(
      "url",
      { value: "https://test.com" },
      defaultTextData,
      defaultWifiData,
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe(true);
  });

  it("returns false when URL is empty", () => {
    const result = canDownload(
      "url",
      { value: "" },
      defaultTextData,
      defaultWifiData,
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe(false);
  });

  it("returns true when WiFi has SSID", () => {
    const result = canDownload(
      "wifi",
      defaultUrlData,
      defaultTextData,
      { ssid: "Network", password: "", encryption: "nopass", hidden: false },
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe(true);
  });

  it("returns false when WiFi SSID is empty", () => {
    const result = canDownload(
      "wifi",
      defaultUrlData,
      defaultTextData,
      { ssid: "", password: "", encryption: "WPA", hidden: false },
      defaultEmailData,
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe(false);
  });

  it("returns true when email has address", () => {
    const result = canDownload(
      "email",
      defaultUrlData,
      defaultTextData,
      defaultWifiData,
      { address: "test@example.com" },
      defaultSmsData,
      defaultPhoneData,
    );
    expect(result).toBe(true);
  });

  it("returns true when SMS has phone", () => {
    const result = canDownload(
      "sms",
      defaultUrlData,
      defaultTextData,
      defaultWifiData,
      defaultEmailData,
      { phone: "+1234567890" },
      defaultPhoneData,
    );
    expect(result).toBe(true);
  });
});

describe("Validation Functions", () => {
  describe("validateUrl", () => {
    it("returns valid for correct URL", () => {
      expect(validateUrl("https://example.com")).toEqual({ valid: true });
    });

    it("returns valid for URL without protocol", () => {
      expect(validateUrl("example.com")).toEqual({ valid: true });
    });

    it("returns invalid for empty string", () => {
      expect(validateUrl("")).toEqual({ valid: false });
    });

    it("returns invalid with message for malformed URL", () => {
      expect(validateUrl("not a url")).toEqual({
        valid: false,
        message: "enterValidUrl",
      });
    });
  });

  describe("validateEmail", () => {
    it("returns valid for correct email", () => {
      expect(validateEmail("test@example.com")).toEqual({ valid: true });
    });

    it("returns invalid for empty string", () => {
      expect(validateEmail("")).toEqual({ valid: false });
    });

    it("returns invalid with message for malformed email", () => {
      expect(validateEmail("notanemail")).toEqual({
        valid: false,
        message: "enterValidEmail",
      });
    });
  });

  describe("validatePhone", () => {
    it("returns valid for correct phone number", () => {
      expect(validatePhone("+1234567890")).toEqual({ valid: true });
    });

    it("returns valid for phone with dashes", () => {
      expect(validatePhone("+1-234-567-8900")).toEqual({ valid: true });
    });

    it("returns invalid for empty string", () => {
      expect(validatePhone("")).toEqual({ valid: false });
    });

    it("returns invalid with message for malformed phone", () => {
      expect(validatePhone("abc")).toEqual({
        valid: false,
        message: "enterValidPhone",
      });
    });
  });

  describe("validateWifi", () => {
    it("returns valid for complete WiFi data", () => {
      expect(
        validateWifi({
          ssid: "Network",
          password: "pass123",
          encryption: "WPA",
          hidden: false,
        }),
      ).toEqual({ valid: true });
    });

    it("returns invalid when SSID is missing", () => {
      expect(
        validateWifi({
          ssid: "",
          password: "pass123",
          encryption: "WPA",
          hidden: false,
        }),
      ).toEqual({ valid: false, message: "ssidRequired" });
    });

    it("returns invalid when password missing for secured network", () => {
      expect(
        validateWifi({
          ssid: "Network",
          password: "",
          encryption: "WPA",
          hidden: false,
        }),
      ).toEqual({ valid: false, message: "passwordRequired" });
    });

    it("returns valid for open network without password", () => {
      expect(
        validateWifi({
          ssid: "OpenNetwork",
          password: "",
          encryption: "nopass",
          hidden: false,
        }),
      ).toEqual({ valid: true });
    });
  });

  describe("validateText", () => {
    it("returns valid for non-empty text", () => {
      expect(validateText("Hello")).toEqual({ valid: true });
    });

    it("returns invalid for empty string", () => {
      expect(validateText("")).toEqual({ valid: false });
    });
  });
});
