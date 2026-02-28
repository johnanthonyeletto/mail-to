import { EmailProvider } from "./types";

export const PROVIDER_MX_SUFFIXES: Record<EmailProvider, string[]> = {
  [EmailProvider.GOOGLE]: [
    // Current (2023+): smtp.google.com
    ".google.com",
    // Legacy: aspmx.l.google.com, alt1-4.aspmx.l.google.com
    ".googlemail.com",
  ],
  [EmailProvider.MICROSOFT]: [
    // <tenant>.mail.protection.outlook.com
    ".mail.protection.outlook.com",
    ".outlook.com",
  ],
  [EmailProvider.ZOHO]: [
    // US: mx.zoho.com, mx2.zoho.com, mx3.zoho.com
    ".zoho.com",
    // EU: mx.zoho.eu, mx2.zoho.eu, mx3.zoho.eu
    ".zoho.eu",
    // India: mx.zoho.in, mx2.zoho.in, mx3.zoho.in
    ".zoho.in",
    // Australia
    ".zoho.com.au",
    // Japan
    ".zoho.jp",
  ],
  [EmailProvider.PROTON]: [
    // mail.protonmail.ch, mailsec.protonmail.ch
    ".protonmail.ch",
  ],
};
