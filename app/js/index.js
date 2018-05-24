// Extra Ordinary Bible Verses - the Google Assistant app!


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


// ============================= Media ======================================

const bibleVerses = {
    1: {
        ref: "Ecclesiastes 4:9-10",
        text: "Two are better than one, because they have a good return for their work: If one falls down, his friend can help him up. But pity the man who falls and has no one to help him up!",
        characterName: "Deb",
        characterUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Deb-Talk.png",
        mp3Url: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Deb-Eccles.mp3",
    },
    2: {
        ref: "Philippians 4:8",
        text: "Whatever things are true, whatever things are noble, whatever things are just, whatever things are pure, whatever things are lovely, whatever things are of good report, if there is any virtue and if there is anything praiseworthy – meditate on these things.",
        characterName: "Deb",
        characterUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Deb-Philipians.png",
        mp3Url: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Deb-Philipians.mp3",
    },
};

const episodes = {
    1: {
        title: "Friendship",
        summary: "Sam reaches out to Hank, the new kid in school. But when he goes too far, is their friendship over before it starts?",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/ep1-friendship.png",
        videoUrl: "https://youtu.be/hoNN8F7KxgM",
    },
    2: {
        title: "Good Thoughts",
        summary: "Is Liana right? Does Hank think Sam is just too annoying?",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/ep2-good-thoughts.png",
        videoUrl: "https://youtu.be/W0s6mKTGAFk",
    },
};

const samWelcomeMessages = [
    {
        text: "Hi, I'm Sam! It's super cool to have you here! How can I help?",
        mp3Url: "",
    },
    {
        text: "I'ts Super Sam time!",
        mp3Url: "",
    },
];

const samWelcomeImageUrl = "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-Welcome.png";

const samWhichEpisodeMessages = [
    {
        text: "Super sorry! Which episode did you want?",
        mp3Url: "",
    },
];

const samWhichEpisodeImageUrl = "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-Confused.png";

const samConfusedMessages = [
    {
        text: "Super sorry! I don't understand! You can ask me to tell you a bible verse, play an episode, or subscribe to be notified when there is something new for you.",
        mp3Url: "",
    },
    {
        text: "I'm super confused right now! Could you ask in a different way? You can ask me to tell you a bible verse, play an episode, or subscribe to be notified when there is something new for you.",
        mp3Url: "",
    },
];

const samConfusedImageUrl = "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-Confused.png";

const samGiveUpMessages = [
    {
        text: "Sorry, my brain may be about to explode. I'm going to take a nap. See you next time!",
        mp3Url: "",
    }
];

const samGiveUpImageUrl = "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-GiveUp.png";

const samGoodbyeMessages = [
    {
        text: "It was super great seeing you here!",
        mp3Url: "",
    },
    {
        text: "Till next time!",
        mp3Url: "",
    },
];

const samGoodbyeImageUrl = "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-Bye.png";

const listOfEpisodesMessages = [
    {
        text: "1 Friendship, 2 Good Thoughts.",
        mp3Url: "",
    },
];

const listOfEpisodesImageUrl = "https://extraordinarytv.files.wordpress.com/2017/12/ep1-teaser-1.png?w=768&h=436&crop=1";

const subscribeMessages = [
    {
        text: "Super cool! I will let you know when I have something great for you! Tricked you! Actually this does not work yet.",
        mp3Url: "",
    },
    {
        text: "Super special content is coming your way soon! Surprise! I can't actually do that yet...",
        mp3Url: "",
    },
];

const subscribeImageUrl = "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-Subscribe.png";

const unsubscribeMessages = [
    {
        text: "Sure thing! Feel free to subscribe again some other time!",
        mp3Url: "",
    },
    {
        text: "Okay! No more nagging from me!",
        mp3Url: "",
    },
];

const unsubscribeImageUrl = "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-Unsubscribe.png";

const verseFromByCharacter = {
    Sam: [{
        text: "Here is a verse from me!",
        mp3Url: "",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Sam-Talk.png",
    }],
    Deb: [{
        text: "Here is a verse from Deb!",
        mp3Url: "",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Deb-Talk.png",
    }],
    Liana: [{
        text: "This verse is super fantastic from Liana!",
        mp3Url: "",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Liana-Talk.png",
    }],
    Hank: [{
        text: "Hank agreed to share this verse.",
        mp3Url: "",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Hank-Talk.png",
    }],
    Helen: [{
        text: "This verse is special to Helen.",
        mp3Url: "",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Helen-Talk.png",
    }],
    Bear: [{
        text: "Bear often keeps to himself, but had this verse to share.",
        mp3Url: "",
        imageUrl: "https://storage.googleapis.com/extra-ordinary-assistant-assets/v1/media/Bear-Talk.png",
    }],
};


// ============================== Application ================================

const app = dialogflow({debug: true});

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
    console.log("Default Welcome Intent");
    conv.data.fallbackCount = 0;
    conv.ask(new Suggestions(['Say a verse', 'Play episode 1', 'List episodes']));
    const msg = pickRandomMessage(samWelcomeMessages);
    respond(conv, msg.text, msg.mp3Url, "Welcome!", samWelcomeImageUrl, "Welcoming Sam");
});

app.intent('Default Fallback Intent', (conv) => {
    console.log("Default fallback intent");
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
    console.log("Goodbye");
    const msg = pickRandomMessage(samGoodbyeMessages);
    respond(conv, msg.text, msg.mp3Url, "Bye!", samGoodbyeImageUrl, "Sam waving goodbye!");
    conv.close();
});

app.intent('Play Random Bible Verse', (conv) => {
    console.log("Play Random Bible Verse");

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

app.intent('Play Episode', (conv, params) => {

    let episode = params.episode;
    console.log(`Play Episode ${episode}`);
    conv.data.fallbackCount = 0;

    if (!episode) {
        conv.ask(new Suggestions(['List episodes', 'Play episode 1', 'Bye']));
        const msg = pickRandomMessage(samWhichEpisodeMessages);
        respond(conv, msg.text, msg.mp3Url, "Which episode?", samWhichEpisodeImageUrl, "Sam talking");
    } else {
        const {title, imageUrl, videoUrl, summary} = episodes[episode];
        
        conv.ask(new Suggestions(['Another verse', 'List Episodes', 'Bye']));
        if (conv.hasScreen) {
            conv.ask(`Here is your requested episode!`);
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
    }
});

app.intent('List Episodes', (conv) => {

    console.log("List of Episodes");
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

app.intent('Subscribe', (conv) => {
    console.log("Subscribe");
    conv.ask(new Suggestions(['Unsubscribe', 'Tell me a verse', 'Play episode 1', 'Bye']));
    const msg = pickRandomMessage(subscribeMessages);
    respond(conv, msg.text, msg.mp3Url, "Subscribe", listOfEpisodesImageUrl, "Sam talking");
});

app.intent('Unsubscribe', (conv) => {
    console.log("Unsubscribe");
    conv.ask(new Suggestions(['Tell me a verse', 'List episodes', 'Bye']));
    const msg = pickRandomMessage(unsubscribeMessages);
    respond(conv, msg.text, msg.mp3Url, "Unsubscribe", listOfEpisodesImageUrl, "Sam talking");
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
