# Customer Directory

A small customer directory built with Vue 3 and TypeScript. It was made as a hands-on CRUD project, with customer data stored in the browser and synced to the CrudAPI service.

## Preview

![Customer directory home page](./screenshots/customer-directory.png)

## What it does

- Add, edit, and remove customer records.
- Check phone numbers, email addresses, and account number format before saving.
- Prevent duplicate customers by name and date of birth, and prevent duplicate email addresses.
- Keep a local copy in `localStorage` and load records from the API when it is available.

## Stack

Vue 3, TypeScript, Vue CLI, Tailwind CSS, Jest, and `libphonenumber-js`.

## Run it locally

Use Node.js 20 or 22 and npm. Install dependencies, copy `.env.example` to `.env.local`, then add your API key to that file.

```sh
npm ci
cp .env.example .env.local
npm run serve
```

The app runs at `http://localhost:8080`. Production builds are created with `npm run build`; `npm run lint` checks the source and `npm run test:unit` runs the unit tests.

The API settings are `VUE_APP_API_BASE_URL` and `VUE_APP_API_KEY`. Vue CLI places `VUE_APP_*` values in the client bundle, so this setup keeps credentials out of Git but does not make an API key private from people using the app. A production deployment should put authenticated API calls behind a server-side proxy.

## Project layout

```text
src/
  assets/       Global styles and static assets
  components/   Customer screens and shared form controls
  domain/       Customer entity and repository
  services/     API and browser storage adapters
  utils/        Input validation
tests/          Unit tests
```

The repository coordinates customer operations and keeps the UI independent from the API and browser storage details. `RestApiService` handles remote requests, while `LocalStorageService` persists the last known customer list in the browser.

## Notes

The API key that was previously committed in `src/configs/config.private.ts` should be revoked and replaced. Removing it from the current source does not remove it from existing Git history. Also, the account-number check currently verifies a length of 8–20 characters containing digits; it is a format check, not a bank-specific verification.
