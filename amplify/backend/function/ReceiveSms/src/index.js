const AWS = require("aws-sdk");

const endpoint = new AWS.Endpoint(
  process.env.API_CHAT_GRAPHQLAPIENDPOINT
);
const credentials = new AWS.EnvironmentCredentials("AWS");

const createMessageMutation = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
  ) {
    createMessage(input: $input) {
      id
      text
      createdAt
      updatedAt
    }
  }
`;

exports.handler = async (event) => {
  if (!event.Records || !event.Records.length) {
    return "No record found";
  }
  const {
    originationNumber: from,
    destinationNumber: to,
    messageBody: text,
  } = JSON.parse(event.Records[0].body);

  const request = new AWS.HttpRequest(endpoint);
  request.method = "POST";
  request.region = process.env.REGION;
  request.headers["Host"] = endpoint.host;
  request.headers["Content-Type"] = "multipart/form-data";
  request.body = JSON.stringify({
    query: createMessageMutation,
    variables: { input: { from, to, text } },
  });

  const signer = new AWS.Signers.V4(request, "appsync", true);
  signer.addAuthorization(credentials, new Date());

  const result = await new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      request,
      null,
      (httpResp) => {
        let body = "";
        httpResp.on("data", (chunk) => (body += chunk));
        httpResp.on("end", () => resolve(body));
      },
      (err) => reject(err)
    );
  });

  return result;
};
