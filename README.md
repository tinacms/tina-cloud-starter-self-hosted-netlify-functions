> Note this repo assumes basic knowledge of using the
> [MongoDB adapter](https://tina.io/docs/self-hosted/database-adapter/mongodb) and
> [ClerkJS](https://tina.io/docs/self-hosted/authentication-provider/clerk-auth) for auth with Tina.

# Getting started

# Copy the `.env.sample` and provide the appropriate values

```
cp .env.sample .env
```

For the `GITHUB_PERSONAL_ACCESS_TOKEN`, ensure you have access to write content to the repo.

## Run the dev server

```
npm run dev
```

This will start both the TinaCMS and Netlify dev servers on your machine. By default, Netlify will serve the app on port 8888.
Visit the admin at `http://localhost:8888/admin/index.html` and login to Clerk, be sure to use the same email address that you supplied
as `TINA_PUBLIC_PERMITTED_EMAIL` in the .env file.

# Going to production

The only difference between local dev with Netlify and running on a Netlify host is that you'll want to be sure the Netlify deployment
has access to the appropriate environment variables. So either copy them from your local setup or provide the productin-level variables
accordingly.
