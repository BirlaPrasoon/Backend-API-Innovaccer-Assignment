var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

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

    quote_count: {type: Number, default: 0},
    reply_count: {type: Number, default: 0},
    retweet_count: {type: Number, default: 0},
    favourite_count: {type: Number, default: 0},

    hashtags: [{name: String}],
    hashtag_count: {type: Number, default: 0},
    urls: [{name: String}],
    urls_count : {type: Number, default: 0},
    user_mentions:[{name: String}],
    user_mentions_count : {type: Number, default: 0},

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
},{_id:false, _V: false});

tweetSchema.index({text:'text',user_name: 'text', user_screen_name: 'text'});
tweetSchema.plugin(mongoosePaginate);

var Tweet = mongoose.model('Tweet', tweetSchema );

module.exports = Tweet;