# mail-to

**mailto: links that don’t suck.** Detect a user’s email provider from MX records and open the right compose experience (Gmail, Outlook, Zoho, Proton) or fall back to `mailto:`.

> **⚠️ Warning:** This library is not battle tested. Use at your own risk. Contributions, bug reports, tests, and improvements are very welcome.

Framework-agnostic. Works in Node and the browser.

## Install

```bash
npm install mail-to
```

## Usage

### Compose (recommended)

Pass a `from` address and a `to`; the library looks up the provider and returns a URL you can open (e.g. Gmail compose, Outlook deeplink, or `mailto:`).

```ts
import { compose } from "mail-to";

const url = await compose({
  from: "user@gmail.com",
  to: "support@example.com",
  subject: "Help",
  body: "Hello…",
});

window.open(url); // or location.href = url
```

Without `from`, it returns a plain `mailto:` URL.

### Detect provider only

```ts
import { getEmailProvider, EmailProvider } from "mail-to";

const provider = await getEmailProvider("user@company.com");
// EmailProvider.GOOGLE | EmailProvider.MICROSOFT | EmailProvider.ZOHO | EmailProvider.PROTON | null
```

Uses [Google DNS over HTTPS](https://dns.google/) to resolve MX records for the domain and matches against known provider hostnames (e.g. `aspmx.l.google.com`, `*.mail.protection.outlook.com`).

### Optional: pass provider yourself

If you already know the provider, pass it to avoid a DNS call:

```ts
await compose({
  from: "user@example.com",
  to: "support@example.com",
  provider: EmailProvider.GOOGLE,
});
```

## API

| Export                    | Description                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `compose(config)`         | `(config: ComposeConfig) => Promise<string>` – Returns a compose URL (provider-specific or `mailto:`).     |
| `getEmailProvider(email)` | `(email: string) => Promise<EmailProvider \| null>` – Resolves MX and returns the provider enum or `null`. |
| `EmailProvider`           | Enum: `GOOGLE`, `MICROSOFT`, `ZOHO`, `PROTON`.                                                             |
| `ComposeConfig`           | `{ from?, to, subject?, body?, provider? }`.                                                               |

## Browser (script tag)

Build outputs a global bundle:

```bash
npm run build
```

Then in HTML:

```html
<script src="node_modules/mail-to/dist/index.js"></script>
<script>
  const url = await MailTo.compose({ from: "…", to: "…" });
  window.open(url);
</script>
```

Or copy `dist/index.js` to your project and reference it.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run build` | Build ESM, CJS, and IIFE to `dist/`. |
| `npm run dev`   | Build in watch mode.                 |

## Publishing

Releases are published to npm via [GitHub Actions](.github/workflows/publish.yml) when you push a version tag. Publishing uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC); no `NPM_TOKEN` secret is required.

### Releasing a new version

1. Bump the version and create a tag:
   ```bash
   npm version patch   # or minor / major
   ```
2. Push the tag to trigger the workflow:
   ```bash
   git push --follow-tags
   ```
   Or push a specific tag: `git push origin v1.0.0`.

The workflow runs on tag push, builds the package, and publishes to npm.

## License

ISC
