import { databaseClient } from "../tina/__generated__/databaseClient";

export async function onRequest(context) {
  console.log("hi", context);
  // const { query, variables } = req.body;
  const result = await databaseClient.request({
    query: `query {collections {__typename}}`,
    variables: {},
  });
  console.log(result);
  // return res.json(result);
  return new Response("Hello, world!");
}
