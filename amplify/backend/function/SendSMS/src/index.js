const AWS = require("aws-sdk");
const pinpoint = new AWS.Pinpoint();

exports.handler = (event) => {
  const applicationId = "725ed269bb71427797d4eee66b4e2919";
  const messageType = "TRANSACTIONAL";
  const senderId = "MySenderID";

  console.log(JSON.stringify(event, null, 2));
  event.Records.filter((record) => record.eventName === "INSERT").forEach(
    (record) => {
      const message = record.dynamodb.NewImage.text.S;
      const originationNumber = record.dynamodb.NewImage.from.S;
      const destinationNumber = record.dynamodb.NewImage.to.S;

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
              Body: message.slice(0, Math.min(message.length, 140)),
              MessageType: messageType,
              OriginationNumber: originationNumber,
              SenderId: senderId,
            },
          },
        },
      };
      console.log(JSON.stringify(params));
      pinpoint.sendMessages(params, function (err, data) {
        // If something goes wrong, print an error message.
        if (err) {
          console.error(err);
          throw err;
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
  return "Successfully processed DynamoDB record";
};
