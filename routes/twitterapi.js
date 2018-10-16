var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Twit = require('twit');
var Tweet = require('../models/Tweets');

const properties = require('../properties');

var T = new Twit(properties.twitter_client);

/**
 * Post method to fetch tweets from stream as requested
 * for requested keyword.
 *
 * request body contains:
 * 1: query: keyword
 * 2: time_to_stream: number (seconds)
 * 3: wipe: Boolean
 *
 * @return number_of_tweets_stored / error message
 * */
router.post('/stream', function(req, res, next) {

     const time_to_stream = req.body.time_to_stream * 1000 /*convert to milli seconds*/;
     const keyword = req.body.query;
     const wipeout_previous = req.body.wipe;

    if(wipeout_previous){
        if(!wipeout()){
            res.statusCode = 500;
            res.send('Couldn\'t wipe out Data, Report.');
            return;
        }
    }

     const stream = T.stream('statuses/filter', { track: keyword });
     const tweets = [];

    stream.on('tweet', function (tweet, err) {
        if(err) throw  err;
        tweets.push(tweet);
    });

    // stop the stream
    setTimeout(()=>stream.stop(),time_to_stream);

    // streamed up, now store tweets to database
    setTimeout(() =>{
        storeTweets(tweets, next, res);
    }, time_to_stream);

});

/**
 * Post method to search tweets as requested
 * for requested keyword.
 *
 * request body contains:
 * 1: query: keyword -> keyword upon which search to perform
 * 2: count: Number -> number of tweets to store
 * 3: wipe_previous -> Boolean: wipe out previous data
 *
 * @return number_of_tweets_stored / error message
 * */
router.post('/search', function(req, res, next) {

    const keyword = req.body.query;
    const wipeout_previous = req.body.wipe_previous;
    const cnt = req.body.count;


    if(wipeout_previous){
        if(!wipeout()){
            res.statusCode = 500;
            res.send('Couldn\'t wipe out Data, Report.');
            return;
        }
    }

    T.get('search/tweets', { q: keyword, count: cnt }, function(err, data) {

        if(err) {
            res.send('Couldn\'t search tweets: ' + err );
            throw err;
        }

        let tweets = data.statuses;
        storeTweets(tweets, next, res);
    });

});

/**
 * Wipe out all previous data in the database
 * @return couldntWipeOut: whether data wiped or not
 * */
function wipeout() {
    var wiped = true;
    Tweet.deleteMany({}).then( function (err) {
        if (err)
            wiped = false;
    });
    return wiped;
}

/**
 * if this is a retweeted status
 * check if the original tweet exists,
 * reference its id.
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function ifRetweetedSaveId(tweets, i) {
    if (tweets[i].retweeted_status != null) {
        tweets[i].is_a_retweeted = true;
        tweets[i].retweeted_status_id = tweets[i].retweeted_status.id;
    }
}

/**
 * if this is a quoted status,  reference its id
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function ifQuotedStoreId(tweets, i) {
    if (tweets[i].is_quote_status && tweets[i].quoted_status != null) {
        tweets[i].quoted_status_id = tweets[i].quoted_status.id;
    }
}

/**
 * if tweet text is truncated, extract full text from the
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function ifTruncatedStoreFullText(tweets, i) {
    if (tweets[i].truncated && tweets[i].extended_tweet != null) {
        tweets[i].full_text = tweets[i].extended_tweet.full_text;
    }
}

/**
 * Separate the user from the Status,
 * if user exists then use its id,
 * else store and use its id.
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @param next: next callback
 * @return void
 * */
function seperateUser(tweets, i, next) {
    tweets[i].user_name = tweets[i].user.name;
    tweets[i].user_screen_name = tweets[i].user.screen_name;
}

/**
 * Separate the place from the Status,
 * if place exists then use its id,
 * else store and then use its id.
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @param next: next callback
 * @return void
 * */
function separatePlaces(tweets, i, next) {
    tweets[i].country = tweets[i].place.country;
    tweets[i].country_code = tweets[i].place.country_code;
    tweets[i].place_name = tweets[i].place.place_name;
    tweets[i].place_type = tweets[i].place.place_type;
}

/**
 * Separate the Hashags (#) from the Status (Statuses)
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function separateHashtags(tweets, i) {
    let n = tweets[i].entities.hashtags.length;

    tweets[i].hashtag_count = n;

    if (n > 0) {
        for (let j = 0; j < n; j++) {
            if(tweets[i].hashtags === undefined)
                tweets[i].hashtags = [];
            tweets[i].hashtags.push({name : tweets[i].entities.hashtags[j].text});
        }
    }
}

/**
 * Separate the URLs from the Status (Entities)
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function separateURLs(tweets, i) {
    var n = tweets[i].entities.urls.length;
    tweets[i].urls_count = n;
    if (n > 0) {
            for (let j = 0; j < n; j++) {
                if(tweets[i].urls === undefined)
                    tweets[i].urls = [];
                tweets[i].urls.push({name:tweets[i].entities.urls[j].url});
            }
    }
}

/**
 * Separate the User mentions (@) from the Status (Entities)
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function separateUserMentions(tweets, i) {
    var n = tweets[i].entities.user_mentions.length;
    tweets[i].user_mentions_count = n;
    if (n > 0) {
        for (var j = 0; j < n; j++) {
            if(tweets[i].user_mentions === undefined)
                tweets[i].user_mentions = [];
            tweets[i].user_mentions.push({name:tweets[i].entities.user_mentions[j].screen_name});
        }
    }
}

/**
 * Find and mark true in the tweet object if
 * tweet contains photo, video content
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function findMediaContent(tweets, i) {
    if (tweets[i].extended_entities != null) {
        let n = tweets[i].extended_entities.media.length;

        for (let k = 0; k < n; k++) {
            let type = tweets[i].extended_entities.media[k].type;
            if (type.trim() === 'photo')
                tweets[i].contains_image = true;
            if (type.trim() === 'video')
                tweets[i].contains_video = true;
        }
    }
}

/**
 * Find and update source device in tweet:
 * (Android, iPhone, iPad, Mac, Web, TweetDeck)
 *
 * @param tweets: list of tweets,
 * @param i: current index to manipulate,
 * @return void
 * */
function findSource(tweets, i) {

    tweets[i].fromiPhone = false;
    tweets[i].fromiPad = false;
    tweets[i].fromMac = false;
    tweets[i].fromAndroid = false;
    tweets[i].fromWebClient = false;
    tweets[i].fromTweetDeck = false;

    let source = tweets[i].source;
    if (source.indexOf('Android') > -1)
        tweets[i].fromAndroid = true;
    else if (source.indexOf('iPhone') > -1)
        tweets[i].fromiPhone = true;
    else if (source.indexOf('iPad') > -1)
        tweets[i].fromiPad = true;
    else if (source.indexOf('Mac') > -1)
        tweets[i].fromMac = true;
    else if (source.indexOf('Web') > -1)
        tweets[i].fromWebClient = true;
    else if (source.indexOf('TweetDeck') > -1)
        tweets[i].fromTweetDeck = true;
}

/**
 *
 * MAIN METHOD: parse and store the tweets in the database
 *
 * 1: Separate User from the status
 * 2: if it's a retweeted status, store its id
 * 3: if it's a quoted status, store its id
 * 4: if it's text is truncated, store full text from the extendedText object
 * 5: Separate the Place  from the Status
 * 6: Separate the Hashtag (#) from the Status (Entities)
 * 7: Separate the URLs from the Status (Entities)
 * 8: Separate the UserMentions (@) from the Status (Entities)
 * 9: find media content if any and mark true (Photo, Video)
 * 10: find source device: (Android, iPhone, iPad, Mac, Web, TweetDeck)
 *
 * @param tweets: list of tweets,
 * @param next: next callback,
 * @param res: response object
 * @return void
 * */
function storeTweets(tweets, next, res) {

    var storedTweets = [];
    for (let i = 0; i < tweets.length; i++) {

        tweets[i]._id = new mongoose.Types.ObjectId();
        seperateUser(tweets, i, next);

        ifRetweetedSaveId(tweets, i);
        ifQuotedStoreId(tweets, i);
        ifTruncatedStoreFullText(tweets, i);

        if(tweets[i].place != null)
            separatePlaces(tweets, i);
        if(tweets[i].entities.hashtags.length >0)
            separateHashtags(tweets, i);
        if(tweets[i].entities.urls.length >0)
            separateURLs(tweets, i);
        if(tweets[i].entities.user_mentions.length >0)
            separateUserMentions(tweets, i);

        findMediaContent(tweets, i);
        findSource(tweets, i);

        // create tweet object and save to database
        var t = new Tweet(tweets[i]).save().then(function (twt) {
            storedTweets.push(twt);
        }(storedTweets), err => next(err)).catch(err => console.log(err));
    }

    res.statusCode = 200;
    res.send({
       tweets_inserted: storedTweets.length
    });

}

module.exports = router;
