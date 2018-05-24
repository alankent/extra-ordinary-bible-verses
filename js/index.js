// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const {
    dialogflow,
    BasicCard,
    Button,
    Image,
    Suggestions,
    SimpleResponse,
} = require('actions-on-google');
const functions = require('firebase-functions');

const bibleVerses = {
    1: {
        ref: "Ecclesiastes 4:9-10",
        text: "Two are better than one, because they have a good return for their work: If one falls down, his friend can help him up. But pity the man who falls and has no one to help him up!",
        characterName: "Deb",
        //characterUrl: "https://extraordinarytv.files.wordpress.com/2017/12/ep1-teaser-1.png?w=768&h=436&crop=1", //Sam
        characterUrl: "https://extraordinarytv.files.wordpress.com/2018/05/deb-ecc-4-9.png?w=768&h=436&crop=1", //Deb
        mp3Url: "https://extraordinarytv.files.wordpress.com/2018/05/deb-ecc-4-9.mp3",
        ssml: "<speak><audio src='https://extraordinarytv.files.wordpress.com/2018/05/deb-ecc-4-9.mp3'>Two are better than one, because they have a good return for their work: If one falls down, his friend can help him up. But pity the man who falls and has no one to help him up! Ecclesiastes 4:9-10.</audio></speak>",
    },
};

const episodes = {
    1: {
        title: "Friendship",
        summary: "Sam reaches out to Hank, the new kid in school. But when he goes too far, is their friendship over before it starts?",
        imageUrl: "https://extraordinarytv.files.wordpress.com/2017/12/ep1-teaser-1.png?w=768&h=436&crop=1",
        videoUrl: "https://youtu.be/hoNN8F7KxgM",
    },
    2: {
        title: "Good Thoughts",
        summary: "Is Liana right? Does Hank think Sam is just too annoying?",
        imageUrl: "https://extraordinarytv.files.wordpress.com/2018/04/ep2-good-thoughts.png?w=768&h=436&crop=1",
        videoUrl: "https://youtu.be/W0s6mKTGAFk",
    },
};

const samWelcomeMessages = [
    "Hi, I'm Sam! It's super cool to have you here! How can I help?",
    "Howdy partner!",
];

const samConfusedMessages = [
    "Sorry?",
    "Eh?",
    "I'm super confused right now!",
];

const samGiveUpMessages = [
    "Since I'm still having trouble, so I'll stop here. See ya next time!."
];

const samGoodbyeMessages = [
    "It was super great seeing you here!",
    "Till next time!",
];

const listOfEpisodesMessage = "<speak><audio>The episodes are ...</audio></speak>";

const listOfEpisodesImageUrl = "https://extraordinarytv.files.wordpress.com/2017/12/ep1-teaser-1.png?w=768&h=436&crop=1";

const app = dialogflow({debug: true});

function pickRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

app.middleware((conv) => {
    conv.hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    conv.hasAudioPlayback = conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
    conv.hasMediaPlayback = conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO');
    conv.hasWebBroswer = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
});

app.intent('Default Welcome Intent', (conv) => {
    console.log("Default Welcome Intent");
    conv.data.fallbackCount = 0;
    conv.ask(new Suggestions(['Say a verse', 'Play episode 1', 'List episodes']));
    conv.ask(pickRandomMessage(samWelcomeMessages));
});

app.intent('Default Fallback Intent', (conv) => {
    console.log("Default fallback intent");
    conv.data.fallbackCount++;
    if (conv.data.fallbackCount < 3) {
        conv.ask(pickRandomMessage(samConfusedMessages));
    } else {
        conv.close(pickRandomMessage(samGiveUpMessages));
    }
});

app.fallback((conv) => {
    console.log("Fallback");
    conv.ask(pickRandomMessage(samConfusedMessages));
});

app.intent('Goodbye', (conv) => {
    console.log("Goodbye");
    conv.close(pickRandomMessage(samGoodbyeMessages));
});

app.intent('Play Random Bible Verse', (conv) => {
    console.log("Play Random Bible Verse");

    const verse = bibleVerses[1];
    const {ref, text, characterName, characterUrl, ssml, mp3Url} = verse;
    
    conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
    conv.data.fallbackCount = 0;
      
    if (conv.hasScreen) {
        
        conv.ask(`<speak><s>Here is a bible verse from ${characterName}.</s> <audio src='${mp3Url}'></audio></speak>`);
        
        let card = new BasicCard({
            title: ref,
            subTitle: characterName,
            image: new Image({
                url: characterUrl,
                alt: characterName,
            }),
            text: text, // Displayed after image.
        });

        conv.ask(card);
        
    } else {
        //conv.ask(`<speak>Here is a bible verse from ${characterName}.</speak>`);
        //conv.ask(ssml);
        conv.ask(`<speak><s>Here is a bible verse from ${characterName}.</s> <audio src='${mp3Url}'>${text}</audio></speak>`);
    }
});

app.intent('Play Episode', (conv, params) => {
    let episode = params.episode;
    console.log("Play Episode = " + JSON.stringify(episode));

    const {title, imageUrl, videoUrl, summary} = episodes[episode];
    
    if (conv.hasScreen) {
        conv.ask(`Here is episode ${episode}, ${title}`);
        conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
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
        conv.ask(`Sorry, no screen!`);
    }
});

app.intent('List Episodes', (conv) => {

    console.log("List of Episodes");
    let s = "";
    const numEpisodes = Object.keys(episodes).length;
    for (let e = 1; e <= numEpisodes; e++) {
        if (e > 1) {
            s = s + ", ";
        }
        s = s + e + " " + episodes[e].title;
    }
    s = s + ".";
    console.log(s);

    if (conv.hasScreen) {
        conv.ask(listOfEpisodesMessage);
        conv.ask(new BasicCard({
            title: 'List of Episodes',
            image: new Image({
                url: listOfEpisodesImageUrl,
                alt: `List of Episodes`,
            }),
            text: s,
        }));
    } else {
        conv.ask(s);
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

