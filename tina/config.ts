import { defineConfig } from "tinacms";
import Clerk from "@clerk/clerk-js/dist/clerk.mjs";

const clerkPubKey = process.env.TINA_PUBLIC_CLERK_PUBLIC_KEY!;
const clerk = new Clerk(clerkPubKey);

/**
 * For premium Clerk users, you can use restrictions
 * https://clerk.com/docs/authentication/allowlist
 */
export const isUserAllowed = (emailAddress: string) => {
  const allowList = ["jeffsee.55@gmail.com"];
  if (allowList.includes(emailAddress)) {
    return true;
  }
  return false;
};

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default defineConfig({
  contentApiUrlOverride: "/.netlify/functions/graphql",
  admin: {
    auth: {
      useLocalAuth: isLocal,
      customAuth: !isLocal,
      getToken: async () => {
        await clerk.load();
        if (clerk.session) {
          return { id_token: (await clerk.session.getToken()) || "" };
        }
        // This will fail
        return { id_token: "noop" };
      },
      logout: async () => {
        await clerk.load();
        await clerk.session?.remove();
      },
      authenticate: async () => {
        clerk.openSignIn({
          redirectUrl: "/admin/index.html", // This should be the Tina admin path
          appearance: {
            elements: {
              // Tina's sign in modal is in the way without this
              modalBackdrop: { zIndex: 20000 },
            },
          },
        });
      },
      getUser: async () => {
        await clerk.load();
        if (clerk.user) {
          if (
            isUserAllowed(clerk.user.primaryEmailAddress?.emailAddress || "")
          ) {
            return true;
          }
          // Handle when a user is logged in outside of the org
          clerk.session?.end();
        }
        return false;
      },
    },
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
