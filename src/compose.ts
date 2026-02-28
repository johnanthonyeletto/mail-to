import { getEmailProvider } from "./provider";
import { EmailProvider } from "./types";

export interface ComposeConfig {
  from?: string | null;
  to: string;
  subject?: string | null;
  body?: string | null;
  provider?: EmailProvider | null;
}

const DEFAULT_COMPOSE_CONFIG: Partial<ComposeConfig> = {
  from: null,
  subject: null,
  body: null,
  provider: null,
};

export const compose = async (config: ComposeConfig): Promise<string> => {
  config = { ...DEFAULT_COMPOSE_CONFIG, ...config };

  if (!config.from) {
    return composeMailTo(config);
  }

  const provider = config.provider ?? (await getEmailProvider(config.from));

  switch (provider) {
    case EmailProvider.GOOGLE:
      return composeGmail(config);
    case EmailProvider.MICROSOFT:
      return composeOutlook(config);
    case EmailProvider.ZOHO:
      return composeZoho(config);
    default:
      return composeMailTo(config);
  }
};

const composeMailTo = ({ from, to, subject, body }: ComposeConfig): string => {
  const url = new URL(`mailto:${to ?? ""}`);
  if (from) url.searchParams.set("from", from);
  if (subject) url.searchParams.set("subject", subject);
  if (body) url.searchParams.set("body", body);
  return url.toString();
};

const composeGmail = ({ from, to, subject, body }: ComposeConfig): string => {
  const account = from ?? "0";

  const gmail = new URL(`https://mail.google.com/mail/u/${account}/`);
  gmail.searchParams.set("extsrc", "mailto");
  gmail.searchParams.set("url", composeMailTo({ from, to, subject, body }));

  return gmail.toString();
};

const composeOutlook = ({ to, subject, body }: ComposeConfig): string => {
  const url = new URL("https://outlook.office.com/mail/deeplink/compose");

  if (to) url.searchParams.set("to", to);
  if (subject) url.searchParams.set("subject", subject);
  if (body) url.searchParams.set("body", body);

  return url.toString();
};

const composeZoho = ({ from, to, subject, body }: ComposeConfig): string => {
  // Zoho doesn't have a documented deeplink with pre-fill support.
  // Best option: use their mailto handler endpoint
  const url = new URL("https://mail.zoho.com/mail/compose.do");
  url.searchParams.set("extsrc", "mailto");
  url.searchParams.set("mode", "compose");
  url.searchParams.set("tp", "zb");
  url.searchParams.set("ct", composeMailTo({ from, to, subject, body }));

  return url.toString();
};

const composeProton = ({ from, to, subject, body }: ComposeConfig): string => {
  // Proton Mail handles mailto via fragment hash
  // Format: https://mail.proton.me/u/{accountIndex}/inbox/#mailto={encodedMailto}
  return `https://mail.proton.me/u/${from ?? "0"}/inbox/#mailto=${encodeURIComponent(composeMailTo({ from, to, subject, body }))}`;
};
