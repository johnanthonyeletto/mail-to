import { PROVIDER_MX_SUFFIXES } from "./consts";
import { EmailProvider, GoogleDNSResponse } from "./types";

export const getEmailProvider = async (
  email: string,
): Promise<EmailProvider | null> => {
  const domain = email.split("@").pop();

  const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);

  if (!res.ok) {
    return null;
  }

  const data: GoogleDNSResponse = await res.json();

  if (!data.Answer) {
    return null;
  }

  for (const answer of data.Answer) {
    // MX data is "priority host." e.g. "10 alt4.aspmx.l.google.com."
    const mxHost = answer.data.replace(/^\d+\s+/, "").trim();
    const normalized = mxHost.toLowerCase().replace(/\.$/, "");
    for (const [provider, suffixes] of Object.entries(PROVIDER_MX_SUFFIXES)) {
      if (suffixes.some((suffix) => normalized.endsWith(suffix))) {
        return provider as EmailProvider;
      }
    }
  }

  return null;
};
