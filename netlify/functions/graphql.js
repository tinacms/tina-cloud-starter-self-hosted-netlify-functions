import { databaseClient } from "../../tina/__generated__/databaseClient";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
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
