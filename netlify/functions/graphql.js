import { databaseClient } from "../../tina/__generated__/databaseClient";
import { Clerk } from "@clerk/backend";
import { isUserAllowed } from "../../tina/config";

const secretKey = process.env.CLERK_SECRET;
const clerk = Clerk({
  secretKey,
});

const isAuthorized = async (event) => {
  if (process.env.TINA_PUBLIC_IS_LOCAL === "true") {
    return true;
  }

  const requestState = await clerk.authenticateRequest({
    headerToken: event.headers["authorization"],
  });
  if (requestState.status === "signed-in") {
    const user = await clerk.users.getUser(requestState.toAuth().userId);
    const primaryEmail = user.emailAddresses.find(
      ({ id }) => id === user.primaryEmailAddressId
    );
    if (primaryEmail && isUserAllowed(primaryEmail.emailAddress)) {
      return true;
    }
  }
  return false;
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }
  if (!isAuthorized(event)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ message: "Not authorized" }),
    };
  }
  const { query, variables } = JSON.parse(event.body);
  const result = await databaseClient.request({
    query,
    variables,
  });
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result),
  };
};
