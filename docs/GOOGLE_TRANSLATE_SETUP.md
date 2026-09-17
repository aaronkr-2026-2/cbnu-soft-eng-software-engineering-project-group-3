# Google Cloud Translation development setup

Verified against official Google documentation: 2026-09-17.

This guide prepares a developer-owned key for personal testing of the Cloud Translation Basic v2 adapter. The React app, credential field, and official Basic v2 NMT adapter are implemented. Run `npm ci` and `npm run dev`, then open http://localhost:5173/. The historical HTML still uses the undocumented endpoint and is excluded from the React build. Live Google account/key compatibility remains unverified.

## Account and API setup

1. Sign in to [Google Cloud Console](https://console.cloud.google.com/).
2. Use the project selector to create a separate project, for example `srt-translator-dev`. Select it before proceeding.
3. Open **Billing** and link a billing account, completing Google's payment setup if required. Cloud Translation requires enabled billing even when monthly credits cover usage.
4. Open **APIs & Services → Library**, search for **Cloud Translation API**, and enable it in this project.

Source: [Cloud Translation setup](https://docs.cloud.google.com/translate/docs/setup).

## Limit development usage

5. In the console's **Quotas & System Limits** page, filter for Cloud Translation API. Find **Characters sent to general model per project per day (v2 and v3)** and request a lower value. Suggested initial testing value: **10,000 characters/day**, sufficient for small synthetic fixtures; it may block a full movie. Verify the new quota is effective before testing; Google says changes can take up to 24 hours. This is a usage limit, not a monthly currency cap.
6. In **Billing → Budgets & alerts**, create a budget scoped to the development project, using an amount you accept, and enable alerts. An alerts-only budget does not stop usage or spending.

Sources: [Translation quotas](https://docs.cloud.google.com/translate/quotas), [billing budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets).

Current standard NMT pricing provides a monthly $10 credit equivalent to the first 500,000 characters, followed by $20 per million characters in the next tier. Remaining credit is not known to this app; do not assume testing is free. Check [current pricing](https://cloud.google.com/products/translate/pricing) before use.

## Create and restrict the key

7. Open **APIs & Services → Credentials → Create credentials → API key**. Name it `srt-translator-local-dev` if the form offers a name. Leave **Authenticate API calls through a service account** unchecked if shown; this design uses a standard API key.
8. Under **API restrictions**, choose **Restrict key**, then **Cloud Translation API** only.
9. Under **Application restrictions**, choose **Websites / HTTP referrers**. For the proposed local development address, add `http://localhost:5173/*`. Add `http://127.0.0.1:5173/*` only if testing through that address. The port is a proposed configuration, not an existing server; match the actual address when scaffolding is complete.
10. Create/save the restricted key. If the console creates it before offering restriction editing, open the key immediately and apply these restrictions before use.

Source: [Create and restrict API keys](https://docs.cloud.google.com/docs/authentication/api-keys). Basic v2 supports API keys; Advanced v3 does not: [Translation authentication](https://docs.cloud.google.com/translate/docs/authentication).

## Troubleshoot signup and missing API restrictions

If the restriction picker shows only **Google Cloud APIs**, do not treat that selection as a Cloud Translation-only restriction. The picker text says it lists enabled APIs. In the same project as the key, open **APIs & Services → Library**, find **Cloud Translation API**, and enable it. Google's [enable link](https://console.cloud.google.com/apis/enableflow?apiid=translate.googleapis.com) identifies the service as `translate.googleapis.com`. Reopen/refresh the key editor, deselect **Google Cloud APIs**, and select **Cloud Translation API**. If it remains missing, verify the key and enabled API belong to the same project. Choose **Websites** for the planned browser app and use the development referrer above. Enabling this official service does not mean using the MVP's undocumented endpoint.

For money deducted during signup, first compare the bank's pending/completed status with **Billing → Transactions** and **Payment overview**, and check whether Billing Overview shows a Free Trial or paid account. The amount alone cannot establish whether it is an authorization hold, payment, prepayment, or usage charge.

- Google documents temporary signup authorizations that can remain pending for 1–14 business days. A released authorization is not a withdrawal of promotional credit. See the [trial FAQ](https://cloud.google.com/signup-faqs).
- If money was actually paid, refund eligibility depends on the payment/account type. Some unused Postpay funds may be refundable; promotional credits cannot be cashed out. Do not promise that an account-specific refund preserves the trial. Ask [Cloud Billing support](https://docs.cloud.google.com/billing/docs/how-to/resolve-issues) to identify the transaction and its effect on trial eligibility before requesting a refund.
- Removing a card is different from receiving a refund. Google requires a valid payment method; a sole Postpay payment method cannot be removed without replacement. Closing billing stops linked services. See [payment methods](https://docs.cloud.google.com/billing/docs/how-to/payment-methods) and [account closure](https://docs.cloud.google.com/billing/docs/how-to/close-or-reopen-billing-account). Do not close the billing account merely to release a pending hold.

## Test the React adapter locally

Copy the key from Google Cloud Console into the app's masked, memory-only credential field and run its Test key action. Then translate a tiny synthetic SRT and check cue count, timestamps, and downloaded output. Test key fetches supported languages and translates `Hello.` (six input characters before retries). Browser CORS and restricted-key compatibility still require a real browser test.

Do not send the key in chat, commit it, add it to `VITE_*`, or save it in browser storage. No `.env` key is needed for this planned browser credential flow. A gitignored server `.env` applies only if a separate local server is explicitly introduced. The application must send the key only to Google in the `x-goog-api-key` header, never a URL; see [Google's REST example](https://docs.cloud.google.com/docs/authentication/api-keys-use).

If testing fails, inspect API enablement, billing, the allowed website/port, and quota status. Share only the error category/message with credentials redacted. Do not remove restrictions or switch to the undocumented endpoint as a workaround. Browser compatibility is unverified until the smoke test passes.

This developer key funds only personal tests. Each public visitor supplies their own key under [ADR-002](ADR-002-USER-FUNDED-PROVIDERS.md). Public deployment does not include the developer key. No Google account, billing configuration, API key, or live translation was created/tested while writing this guide.

Local preparation update, 2026-09-17: the user reports completing Google Cloud project setup and saving a developer key as `GOOGLE_TRANSLATE_API_KEY` in `.env`. The file exists and is excluded from Git by `.gitignore`; its contents were not read. This local developer credential file remains unused by the frontend. Do not rename the variable to `VITE_*` or inject it into the browser bundle. The implemented browser flow requires manual entry into volatile tab memory. Any future server-side use requires an explicitly introduced server boundary; browser-referrer key restrictions must be reconsidered for that different environment. Key validity and restrictions remain untested.
