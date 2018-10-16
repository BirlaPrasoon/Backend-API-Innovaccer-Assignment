# Backend using Twitter API's 
Using Twitter Search/Streaming API to fetch are store the target tweets with metadata
(eg: user details, tweet time, favorites and retweet counts etc ) for a recent high traffic event.

[First API doc](https://github.com/BirlaPrasoon/Backend-API-Innovaccer-Assignment/blob/master/firstAPI/firstAPIDoc.md)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node JS, MongoDB, npm must be pre-installed in the environment, at the time of developement of this project, dependencies are:

 * [NPM](https://www.npmjs.com/package/download) v:6.4.1,
 * [Node JS](https://nodejs.org/en/download/) v:8.10.0
 * [Express JS](https://expressjs.com/) : Framework 
 * [MongoDB](https://www.mongodb.com/download-center/v2/cloud?initial=true) v3.6.8
 * Middlewares : [mongoose](https://www.npmjs.com/package/mongoose), [morgan](https://www.npmjs.com/package/morgan), [pug](https://www.npmjs.com/package/pug), [chalk](https://www.npmjs.com/package/chalk), [jsonexport](https://www.npmjs.com/package/jsonexport)
 * Twitter API Client for Node JS: [Twit](https://www.npmjs.com/package/twit)


### Installing

Install all the dependencies

```
npm install
```
Run the environment 
```
npm start
```

# Curated Tweet Schema
```javascript
var tweetSchema  = new Schema({
    _id: {type: Schema.Types.ObjectId},
    created_at: {type: Date},
    id: {type: Number, required: true, unique: true},
    text: String,
    full_text: String,
    truncated: {type: Boolean, default: false},

    quoted_status_id: Number,

    is_quote_status: {type: Boolean, default: false},

    fromMac: {type: Boolean, default: false},
    fromAndroid: {type: Boolean, default: false},
    fromiPhone: {type: Boolean, default: false},
    fromiPad: {type: Boolean, default: false},
    fromTweetDeck: {type: Boolean, default: false},
    fromWebClient: {type: Boolean, default: false},

    // if the status is retweeted, stote the id of the original tweet
    is_a_retweeted: {type: Boolean, default: false},
    retweeted_status_id: Number,

    quote_count: Number,
    reply_count: Number,
    retweet_count: Number,
    favourite_count: Number,

    hashtags: [{name: String}],
    hashtag_count: Number,
    urls: [{name: String}],
    urls_count : Number,
    user_mentions:[{name: String}],
    user_mentions_count : Number,

    // Place
    country:String,
    country_code: String,
    place_name: String,
    place_type: String,

    // User
    user_name: String,
    user_screen_name: String,

    contains_video: {type: Boolean, default: false},
    contains_image: {type: Boolean, default: false},

    favorited: {type: Boolean, default: false},
    retweeted: {type: Boolean, default: false},
    lang: String,
});
```

## API 1: /twitter
API to store searched/ streamed tweets on specified keyword. [Documentation](https://github.com/BirlaPrasoon/Backend-API-Innovaccer-Assignment/blob/master/firstAPI/firstAPIDoc.md) 

## API 2: /gettweets
API to fetch stored tweets from the database, apply filters and sorting. Returns data in JSON format. [Documentation](https://github.com/BirlaPrasoon/Backend-API-Innovaccer-Assignment/blob/master/secondAPI/secondAPIDoc.md) 

## API 3: /getCSV 
Exactly similar to API 2, returns data in CSV format.
