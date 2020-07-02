This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## 2-way SMS communication with AWS Pinpoint

Possible issues:
- I can't find any way to programatically request long codes (i.e. phone numbers). Seems to be possible through AWS Console only. The option seems to be available on the other hand through Twilio: https://www.twilio.com/docs/phone-numbers/api/availablephonenumber-resource
- There is a limit of 1 message per second per phone number. We need to take extra measures to address this limitation so that we don't end up with unsent messages.
- The cost for a long code seems to be upfront per month. How are we going to manage the phone numbers? Can we reuse them between multiple locations? But then there is a problem because one clinic may receive a message from a patient of a previous clinic!
- There is a limit of $1 by default which should be lifted when performing any real application: https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-awssupport-spend-threshold.html
- If the destination phone number is outside US then the origin will be a generic short code 1795. This may pose some complications as I don't think it's possible to enable 2-way communication in that case (it will probably not receive the messages from clients).
- Investigation is needed to check the AWS Clouformation support for Pinpoint service, not sure if all the features are available.
