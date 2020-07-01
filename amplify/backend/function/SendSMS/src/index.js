exports.handler = (event) => {
  //eslint-disable-line
  console.log(JSON.stringify(event, null, 2));
  event.Records.filter((record) => record.eventName === "INSERT").forEach(
    (record) => {
      console.log("DynamoDB Record: %j", record.dynamodb.NewImage.text);
    }
  );
  return Promise.resolve("Successfully processed DynamoDB record");
};
