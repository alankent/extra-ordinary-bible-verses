// Docs: https://developers.google.com/actions/assistant/updates/notifications
// https://console.developers.google.com/apis/api/actions.googleapis.com/overview?project=extra-ordinary-phase-2-bf6e0
// https://console.developers.google.com/apis/credentials?project=extra-ordinary-phase-2-bf6e0
// project id extra-ordinary-phase-2-bf6e0

const {google} = require('googleapis');
const request = require('request');
const key = require('./extra-ordinary-phase-2-bf6e0-e4356b8e0e4d.json');
const USER_ID = require('./userid.json');
'ABwppHGoT4-ynoOR6PVNmjDkmqTyNt8-KAtZJjQewKi6SWybH8hliS-ZPka9rimmsfs3NE0khPUDKbfkIwtnc7uVPAwrZ0-6li1e-g';

let jwtClient = new google.auth.JWT(
  key.client_email, null, key.private_key,
  ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
  null
);

jwtClient.authorize((err, tokens) => {
  // code to retrieve target userId and intent
  let notif = {
    userNotification: {
      title: 'New Extra Ordinary Bible Verse!',
    },
    target: {
      userId: USER_ID.userId,
      intent: 'New Bible Verse',
      // Expects a IETF BCP-47 language code (i.e. en-US)
      locale: 'en-US'
    },
  };

  request(
    'https://actions.googleapis.com/v2/conversations:send',
    {
      'method': 'POST',
      'auth': {
        'bearer': tokens.access_token,
       },
      'json': true,
      'body': {
        'customPushMessage': notif
      }
    },
    (err, httpResponse, body) => {
      console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
    }
  );
});
