// Docs: https://developers.google.com/actions/assistant/updates/notifications

const {google} = require('googleapis');
const request = require('request');
const key = require('./assistantSecretKey.json');

const admin = require('firebase-admin');
const serviceAccount = require('./firebaseSecretKey.json');

// Connect to firestore using a locally stored credential.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://extra-ordinary-phase-2-bf6e0.firebaseio.com"
});

// Get connection to Cloud Database.
let db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

// Authenticate to Google Assistant.
let jwtClient = new google.auth.JWT(
  key.client_email, null, key.private_key,
  ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
  null
);

// Send a notification to a specific user.
function notify(userId, tokens) {
  request(
    'https://actions.googleapis.com/v2/conversations:send',
    {
      method: 'POST',
      auth: {
        bearer: tokens.access_token,
       },
      json: true,
      body: {
        customPushMessage: {
          userNotification: {
            title: 'A new verse is available!',
          },
          target: {
            userId: userId,
            intent: 'New Bible Verse',
            locale: 'en-US'
          }
        }
      }
    },
    (err, httpResponse, body) => {
      console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
      let docRef = db.collection('subscriptions').doc(userId);
      docRef.set({
          lastNotified: new Date(),
          lastStatusCode: httpResponse.statusCode,
          lastStatusMessage: httpResponse.statusMessage
        },
        { merge: true });
    }
  );
}

// Log on to server, then fetch all the subscriptions to be notified.
jwtClient.authorize((err, tokens) => {
  // code to retrieve target userId and intent
  db.collection('subscriptions').where("notify", "==", true)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let userId = doc.id;
        console.debug(`== Notifying '${userId}'`);
        notify(userId, tokens);
      });
    })
    .catch(function(error) {
      console.log("Error getting subscriptions from database: ", error);
    });
});
