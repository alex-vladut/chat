const AWS = require("aws-sdk");
const pinpoint = new AWS.Pinpoint();

exports.handler = (event) => {
  const applicationId = "725ed269bb71427797d4eee66b4e2919";
  const messageType = "TRANSACTIONAL";

  console.log(JSON.stringify(event, null, 2));
  event.Records.filter((record) => record.eventName === "INSERT").forEach(
    (record) => {
      const message = record.dynamodb.NewImage.text;
      const originationNumber = record.dynamodb.NewImage.from;
      const destinationNumber = record.dynamodb.NewImage.to;

      const params = {
        ApplicationId: applicationId,
        MessageRequest: {
          Addresses: {
            [destinationNumber]: {
              ChannelType: "SMS",
            },
          },
          MessageConfiguration: {
            SMSMessage: {
              Body: message,
              MessageType: messageType,
              OriginationNumber: originationNumber,
            },
          },
        },
      };
      pinpoint.sendMessages(params, function (err, data) {
        // If something goes wrong, print an error message.
        if (err) {
          console.log(err.message);
          // Otherwise, show the unique ID for the message.
        } else {
          console.log(
            "Message sent! " +
              data["MessageResponse"]["Result"][destinationNumber][
                "StatusMessage"
              ]
          );
        }
      });
    }
  );
  return Promise.resolve("Successfully processed DynamoDB record");
};
