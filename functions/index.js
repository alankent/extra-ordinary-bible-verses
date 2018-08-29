// Extra Ordinary Bible Verses - the Google Assistant app!

'use strict';
 
const {
    dialogflow,
    BasicCard,
    Button,
    Image,
    Suggestions,
    SignIn,
    UpdatePermission,
    NewSurface,
} = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const { CLIENT_ID } = require('./secret.js');


// ============================= Media ======================================

//const mediaBase = 'https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media';
const mediaBase = 'https://extra-ordinary-phase-2-bf6e0.firebaseapp.com';

const bibleVerses = {
    1: {
        ref: "Ecclesiastes 4:9-10",
        text: "Two are better than one, because they have a good return for their work: If one falls down, his friend can help him up. But pity the man who falls and has no one to help him up!",
        characterName: "Deb",
        characterUrl: `${mediaBase}/Deb-Talk.png`,
        mp3Url: `${mediaBase}/Deb-Eccles.mp3`,
    },
    2: {
        ref: "Philippians 4:8",
        text: "Whatever things are true, whatever things are noble, whatever things are just, whatever things are pure, whatever things are lovely, whatever things are of good report, if there is any virtue and if there is anything praiseworthy – meditate on these things.",
        characterName: "Deb",
        characterUrl: `${mediaBase}/Deb-Philipians.png`,
        mp3Url: `${mediaBase}/Deb-Philipians.mp3`,
    },
};

const episodes = {
    1: {
        title: "Friendship",
        summary: "Sam reaches out to Hank, the new kid in school. But when he goes too far, is their friendship over before it starts?",
        imageUrl: `${mediaBase}/ep1-friendship.png`,
        videoUrl: "https://youtu.be/hoNN8F7KxgM",
    },
    2: {
        title: "Good Thoughts",
        summary: "Is Liana right? Does Hank think Sam is just too annoying?",
        imageUrl: `${mediaBase}/ep2-good-thoughts.png`,
        videoUrl: "https://youtu.be/W0s6mKTGAFk",
    },
};

const samWelcomeMessages = [
    //{
        //text: "Hi, I'm Sam! It's super cool to have you here! How can I help?",
        //mp3Url: `${mediaBase}/Sam-Welcome-1.mp3`,
    //},
    {
        text: "v23. I'ts Super Sam time!",
        mp3Url: `${mediaBase}/Sam-Welcome-2.mp3`,
    },
];

const samWelcomeImageUrl = `${mediaBase}/Sam-Welcome.png`;

const samWhichEpisodeMessages = [
    {
        text: "Super sorry! Which episode did you want?",
        mp3Url: `${mediaBase}/Sam-WhichEpisode-1.mp3`,
    },
];

const samWhichEpisodeImageUrl = `${mediaBase}/Sam-Confused.png`;

const samConfusedMessages = [
    {
        text: "Super sorry! I don't understand! You can ask me to tell you a bible verse, play an episode, or subscribe to be notified when there is something new for you.",
        mp3Url: `${mediaBase}/Sam-Confused-1.mp3`,
    },
    {
        text: "I'm super confused right now! Could you ask in a different way? You can ask me to tell you a bible verse, play an episode, or subscribe to be notified when there is something new for you.",
        mp3Url: `${mediaBase}/Sam-Confused-2.mp3`,
    },
];

const samConfusedImageUrl = `${mediaBase}/Sam-Confused.png`;

const samGiveUpMessages = [
    {
        text: "Sorry, my brain may be about to explode. I'm going to take a nap. See you next time!",
        mp3Url: `${mediaBase}/Sam-GiveUp-1.mp3`,
    }
];

const samGiveUpImageUrl = `${mediaBase}/Sam-GiveUp.png`;

const samGoodbyeMessages = [
    {
        text: "It was super great seeing you here!",
        mp3Url: `${mediaBase}/Sam-Goodbye-1.mp3`,
    },
    {
        text: "Till next time!",
        mp3Url: `${mediaBase}/Sam-Goodbye-2.mp3`,
    },
];

const samGoodbyeImageUrl = `${mediaBase}/Sam-Bye.png`;

const listOfEpisodesMessages = [
    {
        // This recording has to be updated every time a new episode comes out because speech synthesis is not used.
        text: "1 Friendship, 2 Good Thoughts.",
        mp3Url: `${mediaBase}/Sam-List-1.mp3`,
    },
];

const listOfEpisodesImageUrl = `${mediaBase}/Sam-List.png`;

const subscribeMessages = [
    {
        text: "Super cool! I will let you know when I have something great for you! Tricked you! Actually this does not work yet.",
        mp3Url: `${mediaBase}/Sam-Subscribe-1.mp3`,
    },
    {
        text: "Super special content is coming your way soon! Surprise! I can't actually do that yet...",
        mp3Url: `${mediaBase}/Sam-Subscribe-2.mp3`,
    },
];

const subscribeImageUrl = `${mediaBase}/Sam-Subscribe.png`;

const unsubscribeMessages = [
    {
        text: "Sure thing! Feel free to subscribe again some other time!",
        mp3Url: `${mediaBase}/Sam-Unsubscribe-1.mp3`,
    },
    {
        text: "Okay! No more nagging from me!",
        mp3Url: `${mediaBase}/Sam-Unsubscribe-2.mp3`,
    },
];

const unsubscribeImageUrl = `${mediaBase}/Sam-Unsubscribe.png`;

const verseFromByCharacter = {
    Sam: [{
        text: "Here's a verse from me!",
        mp3Url: `${mediaBase}/Sam-VerseFrom-Sam.mp3`,
        imageUrl: `${mediaBase}/Sam-Talk.png`,
    }],
    Deb: [{
        text: "Here's a verse from Deb!",
        mp3Url: `${mediaBase}/Sam-VerseFrom-Deb.mp3`,
        imageUrl: `${mediaBase}/Deb-Talk.png`,
    }],
    Liana: [{
        text: "This verse is super fantastic from Liana!",
        mp3Url: `${mediaBase}/Sam-VerseFrom-Liana.mp3`,
        imageUrl: `${mediaBase}/Liana-Talk.png`,
    }],
    Elenor: [{
        text: "I think this is Elenors favorite verse!",
        mp3Url: `${mediaBase}/Sam-VerseFrom-Elenor.mp3`,
        imageUrl: `${mediaBase}/Elenor-Talk.png`,
    }],
    Hank: [{
        text: "Hank agreed to share this verse.",
        mp3Url: `${mediaBase}/Sam-VerseFrom-Hank.mp3`,
        imageUrl: `${mediaBase}/Hank-Talk.png`,
    }],
    Helen: [{
        text: "This verse is special to Helen.",
        mp3Url: `${mediaBase}/Sam-VerseFrom-Helen.mp3`,
        imageUrl: `${mediaBase}/Helen-Talk.png`,
    }],
    Bear: [{
        text: "Bear often keeps to himself, but had this verse to share.",
        mp3Url: "",
        imageUrl: `${mediaBase}/Bear-Talk.png`,
    }],
};

const samHereIsYourEpisodeMessage = {
    text: "Here is your episode!",
    mp3Url: `${mediaBase}/Sam-YourEpisode.mp3`,
};

const samSorryNoScreenMessage = {
    text: "Sorry, I cannot find a screen to play the video on!",
    mp3Url: `${mediaBase}/Sam-NoScreen.mp3`,
};


// ============================== Application ================================

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = dialogflow({debug: true});
//const app = dialogflow({debug: true, clientId: CLIENT_ID});

function pickRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

function pickRandomVerse() {
    return bibleVerses[Math.floor(Math.random() * Object.keys(bibleVerses).length) + 1];
}

function respond(conv, longText, mp3Url, title, imageUrl, imageAlt) {

    if (conv.hasScreen) {
        const shortText = pickRandomMessage(["Here you go!", "Coming right up!", "I'm on it!", "Super fast is super cool!"]);
        conv.ask(`<speak><audio src="${mp3Url}">${shortText}</audio></speak>`);
        conv.ask(new BasicCard({
            title: title,
            image: new Image({
                url: imageUrl,
                alt: imageAlt,
            }),
            text: longText,
        }));
    } else {
        conv.ask(`<speak><audio src="${mp3Url}">${longText}</audio></speak>`);
    }
}

app.middleware((conv) => {
	console.log(">>> " + JSON.stringify(Object.keys(conv)) + " <<<");
    conv.hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    conv.hasAudioPlayback = conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
    conv.hasMediaPlayback = conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO');
    conv.hasWebBroswer = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
});

app.fallback((conv) => {
    console.log("Fallback");
    conv.ask(new Suggestions(['Say a verse', 'Play episode 1', 'Subscribe']));
    const msg = pickRandomMessage(samConfusedMessages);
    respond(conv, msg.text, msg.mp3Url, "Sorry! I don't understand!", samConfusedImageUrl, "Confused Sam");
});

app.intent('Default Welcome Intent', (conv) => {
    console.log("*** Default Welcome Intent ***");
    conv.data.fallbackCount = 0;
    conv.ask(new Suggestions(['Say a verse', 'Play episode 1', 'List episodes']));
    const msg = pickRandomMessage(samWelcomeMessages);
    respond(conv, msg.text, msg.mp3Url, "Welcome!", samWelcomeImageUrl, "Welcoming Sam");
});

app.intent('Default Fallback Intent', (conv) => {
    console.log("*** Default fallback intent ***");
    conv.data.fallbackCount++;
    conv.ask(new Suggestions(['Say a verse', 'Play episode 1', 'Subscribe']));
    if (conv.data.fallbackCount < 3) {
        const msg = pickRandomMessage(samConfusedMessages);
        respond(conv, msg.text, msg.mp3Url, "Sorry! I don't understand!", samConfusedImageUrl, "Confused Sam");
    } else {
        const msg = pickRandomMessage(samGiveUpMessages);
        respond(conv, msg.text, msg.mp3Url, "So sorry! Give up!", samGiveUpImageUrl, "Sam giving up!");
        conv.close();
    }
});

app.intent('Goodbye', (conv) => {
    console.log("*** Goodbye ***");
    const msg = pickRandomMessage(samGoodbyeMessages);
    respond(conv, msg.text, msg.mp3Url, "Bye!", samGoodbyeImageUrl, "Sam waving goodbye!");
    conv.close();
});

app.intent('Play Random Bible Verse', (conv) => {
    console.log("*** Play Random Bible Verse ***");

    const verse = pickRandomVerse();
    const {ref, text, characterName, characterUrl, mp3Url} = verse;
    const verseFrom = pickRandomMessage(verseFromByCharacter[characterName]);
    
    conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
    conv.data.fallbackCount = 0;
      
    if (conv.hasScreen) {
        
        conv.ask(`<speak><s><audio src="${verseFrom.mp3Url}">${verseFrom.text}</audio></s> <audio src='${mp3Url}'></audio></speak>`);
        conv.ask(new BasicCard({
            title: ref,
            subTitle: characterName,
            image: new Image({
                url: characterUrl,
                alt: characterName,
            }),
            text: text,
        }));

    } else {
        conv.ask(`<speak><s><audio src="${verseFrom.mp3Url}">${verseFrom.text}</audio></s> <audio src='${mp3Url}'>${text}</audio></speak>`);
    }
});

app.intent('New Bible Verse', (conv) => {
    console.log("*** New Bible Verse ***");

    //TODO: THIS should remember verses played before, then only play a verse they have not heard before.
    const verse = pickRandomVerse();
    const {ref, text, characterName, characterUrl, mp3Url} = verse;
    const verseFrom = pickRandomMessage(verseFromByCharacter[characterName]);
    
    conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
    conv.data.fallbackCount = 0;
      
    if (conv.hasScreen) {
        
        conv.ask(`<speak><s><audio src="${verseFrom.mp3Url}">${verseFrom.text}</audio></s> <audio src='${mp3Url}'></audio></speak>`);
        conv.ask(new BasicCard({
            title: ref,
            subTitle: characterName,
            image: new Image({
                url: characterUrl,
                alt: characterName,
            }),
            text: text,
        }));

    } else {
        conv.ask(`<speak><s><audio src="${verseFrom.mp3Url}">${verseFrom.text}</audio></s> <audio src='${mp3Url}'>${text}</audio></speak>`);
    }
});

app.intent('Play Specific Verse Number', (conv, params) => {
    console.log("*** Play Specific Verse ***");

    let verseId = params.verse;
    if (verseId === null || !(verseId in bibleVerses)) {
        // Should not happen, but play it safe.
        verseId = 1;
    }
    console.log(`  ==> Play verse ${verseId}`);

    const verse = bibleVerses[verseId];
    const {ref, text, characterName, characterUrl, mp3Url} = verse;
    const verseFrom = pickRandomMessage(verseFromByCharacter[characterName]);
    
    conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
    conv.data.fallbackCount = 0;
      
    if (conv.hasScreen) {
        conv.ask(`<speak><s><audio src="${verseFrom.mp3Url}">${verseFrom.text}</audio></s> <audio src='${mp3Url}'></audio></speak>`);
        conv.ask(new BasicCard({
            title: ref,
            subTitle: characterName,
            image: new Image({
                url: characterUrl,
                alt: characterName,
            }),
            text: text,
        }));
    } else {
        conv.ask(`<speak><s><audio src="${verseFrom.mp3Url}">${verseFrom.text}</audio></s> <audio src='${mp3Url}'>${text}</audio></speak>`);
    }
});

app.intent('Play Episode', (conv, params) => {

    let episode = params.episode;
    console.log(`*** Play Episode ${episode} ***`);
    conv.data.fallbackCount = 0;

    if (episode === null || !(episode in episodes)) {
        conv.ask(new Suggestions(['List episodes', 'Play episode 1', 'Bye']));
        const msg = pickRandomMessage(samWhichEpisodeMessages);
        respond(conv, msg.text, msg.mp3Url, "Which episode?", samWhichEpisodeImageUrl, "Sam talking");
    } else {
	console.log(JSON.stringify(episodes[episode]));
        const {title, imageUrl, videoUrl, summary} = episodes[episode];
        
        conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
        if (conv.hasScreen) {
            conv.ask(`<speak><audio src="${samHereIsYourEpisodeMessage.mp3Url}">${samHereIsYourEpisodeMessage.text}</audio></speak>`);
            conv.ask(new BasicCard({
                title: title,
                image: new Image({
                    url: imageUrl,
                    alt: `Episode ${episode}`,
                }),
                text: summary,
                buttons: new Button({
                    title: 'Play Video',
                    url: videoUrl,
                })
            }));
        } else {
            const browserAvailable = conv.available.surfaces.capabilities.has('actions.capability.WEB_BROWSER');
            if (browserAvailable) {
                
                // Save episode number away in session data, so when the app is opened on the new device, the episode number will be there ready.
                conv.user.storage.episode = episode;
                
                const context = `Play episode ${episode}`;
                const notification = `Episode ${episode}`;
                const capabilities = ['actions.capability.WEB_BROWSER'];
                conv.ask(new NewSurface({context, notification, capabilities}));
                
            } else {
                conv.ask(`<speak><audio src="${samSorryNoScreenMessage.mp3Url}">${samSorryNoScreenMessage.text}</audio></speak>`);
            }
        }
    }
});

app.intent('List Episodes', (conv) => {

    console.log("*** List of Episodes ***");
    conv.data.fallbackCount = 0;

    // let s = ``;
    // const numEpisodes = Object.keys(episodes).length;
    // for (let e = 1; e <= numEpisodes; e++) {
    //     if (e > 1) {
    //         s += `, `;
    //     }
    //     s += `${e} ${episodes[e].title}`;
    // }
    // s += `.`;

    conv.ask(new Suggestions(['Play episode 1', 'Bye']));
    const msg = pickRandomMessage(listOfEpisodesMessages);
    respond(conv, msg.text, msg.mp3Url, "List of Episodes", listOfEpisodesImageUrl, "Sam talking");
});

function getUserId(conv) {
    //TODO: If not subscribed already... see conv.userStorage.
	console.log(JSON.stringify(conv.user.storage));
    if (!conv.user.storage.subscriberId) {
	console.log("Asking for permissions to notify");
        conv.ask(new UpdatePermission({intent: 'New Bible Verse'}));
        //conv.ask(new UpdatePermission({intent: 'new_bible_verse'}));
	console.log("created new_bible_verse update");
	    //conv.ask("Permissions please to spam you?");
        //conv.ask(new UpdatePermission({intent: 'new_bible_verse'}));
	return null;
    }
	console.log("No need to ask for permission");
    return conv.user.storage.subscriberId;
}

app.intent('Subscribe', (conv) => {
    console.log("*** Subscribe ***");

    const userId = getUserId(conv);
	if (userId === null) {
	console.log("No permission to get user id");
		return;
	}
	console.log("Great, userid is " + userId);

    // TODO: This needs to be extended to ask user permission to save their identity in a firebase table.
    // Separate code (not in the app) then sends notifications to all subscribes when a new episode or verse becomes available.

	/*
    console.log(JSON.stringify(conv.user));
    if (!conv.user.profile) {
        conv.ask(new SignIn('To get your account details'));
        return;
    }
    const userId = conv.user.profile.sub;
    console.log(`USERID = ${userId}`);
    var userData = db.collection('users').doc(userId);
    userData.set({'subscribed':true});
    */

    conv.ask(new Suggestions(['Unsubscribe', 'Tell me a verse', 'Play episode 1', 'Bye']));
    const msg = pickRandomMessage(subscribeMessages);
    respond(conv, msg.text, msg.mp3Url, "Subscribe", listOfEpisodesImageUrl, "Sam talking");
});

app.intent('Subscription Intent Permission', (conv) => {
    console.log("*** Subscription Intent Permission ***");
    if (conv.arguments.get('PERMISSION')) {
	console.log("Got permission!");
	console.log(JSON.stringify(conv.arguments));
        const userId = conv.arguments.get('UPDATES_USER_ID');
	console.log("Userid is " + userId);
        //TODO: SAVE TO DB?
        conv.user.storage.subscriberId = userId;
        conv.ask(new Suggestions(['Unsubscribe', 'Play episode 1', 'Bye']));
        const msg = pickRandomMessage(subscribeMessages);
        respond(conv, msg.text, msg.mp3Url, "Subscribe", listOfEpisodesImageUrl, "Sam talking");
    } else {
        //TODO: Better 'okay, maybe later' response.
	console.log("Permission not granted");
        conv.ask('Ok, feel free to subscribe later if you want to.');
        delete conv.user.storage.subscriberId;
    }
});

app.intent('Unsubscribe', (conv) => {
    console.log("*** Unsubscribe ***");
    // TODO: Could say 'you were not subscribed' to be friendlier.
    // TODO: This needs to be extended to remove subscription record in firebase.
    delete conv.user.storage.subscriberId;
    conv.ask(new Suggestions(['Tell me a verse', 'List episodes', 'Bye']));
    const msg = pickRandomMessage(unsubscribeMessages);
    respond(conv, msg.text, msg.mp3Url, "Unsubscribe", listOfEpisodesImageUrl, "Sam talking");
});

// This is how the app is launched if control was transferred from a different device.
app.intent('Get New Surface', (conv, input, newSurface) => {
    console.log("*** GET NEW SURFACE ***");

    if (newSurface.status === 'OK') {
        
        conv.data.fallbackCount = 0;
        conv.ask(new Suggestions(['Tell me a verse', 'Play episode 1', 'List episodes']));
        
        // If we got the episode number, offer to play it immediately.
        if (conv.user.storage.episode !== null) {
            let episode = conv.user.storage.episode;
            const {title, imageUrl, videoUrl, summary} = episodes[episode];
            
            conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
            conv.ask(`<speak><audio src="${samHereIsYourEpisodeMessage.mp3Url}">${samHereIsYourEpisodeMessage.text}</audio></speak>`);
            conv.ask(new BasicCard({
                title: title,
                image: new Image({
                    url: imageUrl,
                    alt: `Episode ${episode}`,
                }),
                text: summary,
                buttons: new Button({
                    title: 'Play Video',
                    url: videoUrl,
                })
            }));
            
        } else { 
            // We transferred, but the episode number was not specified.
            const msg = pickRandomMessage(samWelcomeMessages);
            respond(conv, msg.text, msg.mp3Url, "Welcome!", samWelcomeImageUrl, "Welcoming Sam");
        }
    } else {
        // The user rejected the hand over.
        const msg = pickRandomMessage(samGoodbyeMessages);
        respond(conv, msg.text, msg.mp3Url, "Bye!", samGoodbyeImageUrl, "Sam waving goodbye!");
        conv.close();
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
