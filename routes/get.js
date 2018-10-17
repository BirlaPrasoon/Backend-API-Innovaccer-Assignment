var express = require('express');
var router = express.Router();
var Tweet = require('../models/Tweets');

/**
 * Find all the tweets in the database
 *
 * 1: size – How many records per page (Optional for Pagination)
 * 2: pageNo – the number of the page (Optional for Pagination)
 *
 * @return places_found / error message
 * */
router.post('/all', function( req, res, next){
    var sortOrder = null;
    execQuery({},sortOrder,req,res,next);
});

/**
 * Find Tweets sorted according to given rule
 *
 * value 1 represents : Descending order
 * value -1 represents: Ascending order
 *
 * request body contains:
 * 1: created_at: [-1,1]
 * 2: user_name: [-1,1]
 * 3: user_screen_name: [-1,1]
 * 4: text: [-1,1]
 * 5: retweet_count: [-1,1]
 * 6: favorite_count: [-1,1]
 * 7: hashtag_count: [-1,1]
 * 8: urls_count: [-1,1]
 * 9: user_mentions_count: [-1,1]
 *
 * 10: size – How many records per page (Optional for Pagination)
 * 11: pageNo – the number of the page (Optional for Pagination)
 *
 * @return places_found / error message
 * */
router.post('/sorted', function(req, res, next){

    let order = {};
    if(req.body.created_at!=null)
        order.created_at = req.body.created_at;
    if(req.body.user_name!=null)
        order.user_name = String(req.body.user_name);
    if(req.body.user_screen_name!=null)
        order.user_screen_name = req.body.user_screen_name;
    if(req.body.text!=null)
        order.text = req.body.text;
    if(req.body.retweet_count!=null)
        order.retweet_count = req.body.retweet_count;
    if(req.body.favourite_count!=null)
        order.favourite_count = req.body.favourite_count;
    if(req.body.hashtag_count!=null)
        order.hashtag_count = req.body.hashtag_count;
    if(req.body.urls_count!=null)
        order.urls_count = req.body.urls_count;
    if(req.body.user_mentions_count!=null)
        order.user_mentions_count = req.body.user_mentions_count;


    if(order!=null) {
        execQuery({},order,req,res,next);
    }else {
        res.statusCode = 200;
        res.send('No order specified!')
    }
});

/**
 * Find Tweet with given original tweet_id
 *
 * 1: size – How many records per page (Optional for Pagination)
 * 2: pageNo – the number of the page (Optional for Pagination)
 *
 * @return places_found / error message
 * */
router.get('/withTweetId/:tweet_id', function( req, res, next){
    var tweetid  = parseInt(req.params.tweet_id);
    let sortOrder = null;
    if(tweetid!=null){
        query = {id: tweetid};
        execQuery(query,sortOrder,req,res,next);
    }
    else {
        res.statusCode = 200;
        res.send('Invalid "tweet_id" Or no "id" supplied');
    }

});

/**
 * Find Tweets containing given text
 *
 * request body contains:
 * 1: text: String
 * 2: exact_match: Boolean,
 * 3: starts_with: Boolean,
 * 4: ends_with: Boolean
 * 5: size – How many records per page (Optional for Pagination)
 * 6: pageNo – the number of the page (Optional for Pagination)
 *
 * @return places_found / error message
 * */
router.post('/withText', function( req, res, next){

    let withText = req.body.text;
    let sortOrder = null;
    if(withText == null){
        res.statusCode = 200;
        res.send('No text supplied!');
        return;
    }

    withText = findPattern(req,withText);

    // var query = {$text: {$search: withText}};
    var query = {text: {$regex: withText}};
    execQuery(query,sortOrder,req, res, next);
});

/**
 * Find Tweets containing given number of hashtags (#)
 *
 * request body contains:
 * 1: gte: Number -> greater than equal to
 * 2: lte: Number -> less than equal to
 * 3: exact: Number -> Exactly (If supplied, will be considered)
 * 4: size – How many records per page (Optional for Pagination)
 * 5: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withNumberOfHashtags', function( req, res, next){

    let gte = req.body.gte;
    let lte = req.body.lte;
    let exact = req.body.exact;
    let sortOrder = null;
    if(exact!= null)
        query = {"hashtag_count": exact};
    if(gte !=null && lte != null){
        query = {"hashtag_count": {$gte : gte, $lte: lte}};
    } else if(gte ==null && lte != null){
        query = {"hashtag_count": {$lte : lte}};
    }else if(gte !=null && lte == null){
        query = {"hashtag_count": {$gte : gte}};
    } else {
        res.statusCode = 200;
        res.send('No of hashtags either not supplied or exceeds range.');
        return;
    }

    execQuery(query,sortOrder,req, res, next);

});

/**
 * Find Tweets containing given number of URLs
 *
 * request body contains:
 * 1: gte: Number -> greater than equal to
 * 2: lte: Number -> less than equal to
 * 3: exact: Number -> Exactly (If supplied, will be considered)
 *
 * @return tweets_found / error message
 * */
router.post('/withNumberOfUrls', function( req, res, next){

    let gte = req.body.gte;
    let lte = req.body.lte;
    let exact = req.body.exact;

    var query;
    let sortOrder = null;
    if(exact!= null)
        query = {"urls_count": exact};
    if(gte !=null && lte != null){
        query = {"urls_count": {$gte : gte, $lte: lte}};
    } else if(gte ==null && lte != null){
        query = {"urls_count": {$lte : lte}};
    }else if(gte !=null && lte == null){
        query = {"urls_count": {$gte : gte}};
    } else {
        res.statusCode = 200;
        res.send('No of urls either not supplied or exceeds range');
        return;
    }

    execQuery(query,sortOrder,req, res, next);

});

/**
 * Find Tweets containing given number of UserMentions
 *
 * request body contains:
 * 1: gte: Number -> greater than equal to
 * 2: lte: Number -> less than equal to
 * 3: exact: Number -> Exactly (If supplied, will be considered)
 * 4: size – How many records per page (Optional for Pagination)
 * 5: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withNumberOfUserMentions', function( req, res, next){

    let gte = req.body.gte;
    let lte = req.body.lte;
    let exact = req.body.exact;

    var query;
    let sortOrder = null;
    if(exact!= null)
        query = {"user_mentions_count": exact};
    if(gte !=null && lte != null){
        query = {"user_mentions_count": {$gte : gte, $lte: lte}};
    } else if(gte ==null && lte != null){
        query = {"user_mentions_count": {$lte : lte}};
    }else if(gte !=null && lte == null){
        query = {"user_mentions_count": {$gte : gte}};
    } else {
        res.statusCode = 200;
        res.send('No of user mentions either not supplied or exceeds range.');
        return;
    }

    execQuery(query,sortOrder,req, res, next);

});

/**
 * Find Tweets containing given usermention (@)
 *
 * request body contains:
 * 1: user_mention: String
 * 2: exact_match: Boolean,
 * 3: starts_with: Boolean,
 * 4: ends_with: Boolean
 * 2: size – How many records per page (Optional for Pagination)
 * 3: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withUserMention', function( req, res, next){

    let user_mention = String(req.body.user_mention);
    let sortOrder = null;
    if(user_mention !=null){
        // query = {user_mentions: {$elemMatch: {name: user_mention}}};

        user_mention =  findPattern(req, user_mention);

        query = {user_mentions: {$elemMatch: {name:{$regex: user_mention}}}};
        execQuery(query,sortOrder,req, res, next);
    }
    else {
        res.statusCode = 200;
        res.send('No user_mention supplied.');
    }

});

/**
 * Find Tweets containing given hashtag (#)
 *
 * request body contains:
 * 1: hashtag: String
 * 2: exact_match: Boolean,
 * 3: starts_with: Boolean,
 * 4: ends_with: Boolean
 * 5: size – How many records per page (Optional for Pagination)
 * 6: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withHashtag', function( req, res, next){

    let hashtag = req.body.hashtag;
    let sortOrder = null;
    if(hashtag !=null){
        hashtag = findPattern(req,hashtag);
        query = {hashtags: {$elemMatch: {name: {$regex : hashtag}}}};
        execQuery(query,sortOrder,req, res, next);
    }else {
        res.statusCode = 200;
        res.send('No hashtag supplied');
    }

});

/**
 * Find Tweets containing given urls
 *
 * request body contains:
 * 1: url: String
 * 2: exact_match: Boolean,
 * 3: starts_with: Boolean,
 * 4: ends_with: Boolean
 * 5: size – How many records per page (Optional for Pagination)
 * 6: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withUrl', function( req, res, next){

    let url = req.body.url;
    let sortOrder = null;
    if(url !=null){
        url = findPattern(req,url);
        query = {urls: {$elemMatch: {name: {$regex: url}}}};
        execQuery(query,sortOrder,req, res, next);
    }else {
        res.statusCode = 200;
        res.send('No url supplied');
    }

});

/**
 * Find Tweets from a user with given user_name
 *
 * request body contains:
 * 1: user_name: String
 * 2: exact_match: Boolean,
 * 3: starts_with: Boolean,
 * 4: ends_with: Boolean
 * 5: size – How many records per page (Optional for Pagination)
 * 6: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/fromUserWithUsername', function( req, res, next){

    let user_name = req.body.user_name;
    let sortOrder = null;
    if(user_name !=null){
        user_name = findPattern(req,user_name);
        query = {user_name : {$regex : user_name}};
        execQuery(query,sortOrder ,req, res, next);
    }
    else {
        res.statusCode = 200;
        res.send('No user_name supplied.');
    }

});

/**
 * Find Tweets from a user with given screen_name
 *
 * request body contains:
 * 1: screen_name: String
 * 2: exact_match: Boolean,
 * 3: starts_with: Boolean,
 * 4: ends_with: Boolean
 * 5: size – How many records per page (Optional for Pagination)
 * 6: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/fromUserWithScreenName', function( req, res, next){

    let screen_name = req.body.screen_name;
    var sortOrder = null;
    if(screen_name !=null){
        screen_name = findPattern(req,screen_name);
        var query = {user_screen_name : {$regex: screen_name}};
        execQuery(query,sortOrder,req, res, next);
    }
    else {
        res.statusCode = 200;
        res.send('No screen_name supplied.');
    }

});

/**
 * Find Tweets in date range
 *
 * request body contains:
 *
 *  Note: date_first should have occurred before date_second
 *
 * 1: date_first: ISO format (if only this supplied: gte this will result)
 * 2: data_second: ISO format(if only this supplied: lte this will result)
 * 2: size – How many records per page (Optional for Pagination)
 * 3: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withinDateRange', function( req, res, next){

    var date1 = req.body.date_first;
    var date2 = req.body.date_second;

    var query;
    let sortOrder = null;
    if(date1 != null && date2 != null) {
        query = {created_at: {$gte: date1, $lte: date2}};
        execQuery(query,res,next);
    }else if(date1!=null && date2 == null){
        query = {created_at : {$gte: date1}};
    }else if(date1==null && date2 != null){
        query = {created_at: {$lte: date2}}
    }
    else {
        res.statusCode = 200;
        res.send('Either date format not supported or dates not supplied or only one date supplied');
        return ;
    }
    execQuery(query,sortOrder,req,res,next);
});

/**
 * Find Tweets on date
 *
 * request body contains:
 * 1: date: ISO format
 * 2: size – How many records per page (Optional for Pagination)
 * 3: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/onDate', function( req, res, next){

    var date = req.body.date;

    if(date != null) {

        const query = {created_at: date};
        let sortOrder = null;
        execQuery(query,sortOrder,req, res, next);
    } else {
        res.statusCode = 200;
        res.send('Either date is not provided or date format not supported ');
    }

});

/**
 * Find Tweets where retweet_count is
 *
 * request body contains:
 * 1: gte: Number -> greater than equal to
 * 2: lte: Number -> less than equal to
 * 3: exact: Number -> Exactly (If supplied, will be considered)
 * 4: size – How many records per page (Optional for Pagination)
 * 5: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withRetweetCount', function( req, res, next){

    let gte = req.body.gte;
    let lte = req.body.lte;
    let exact = req.body.exact;

    var query;
    let sortOrder = null;
    if(exact!= null)
        query = {"retweet_count": exact};
    if(gte !=null && lte != null){
        query = {"retweet_count": {$gte : gte, $lte: lte}};
    } else if(gte ==null && lte != null){
        query = {"retweet_count": {$lte : lte}};
    }else if(gte !=null && lte == null){
        query = {"retweet_count": {$gte : gte}};
    } else {
        res.statusCode = 200;
        res.send('No parameters supplied!' + hashtag);
        return;
    }
    execQuery(query,sortOrder,req, res, next);
});

/**
 * Find Tweets which are retweets
 *
 * request body contains:
 * 1: size – How many records per page (Optional for Pagination)
 * 2: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/isARetweet', function( req, res, next){
    query = {is_a_retweeted: true};
    var sortOrder = null;
    execQuery(query,sortOrder,req, res, next);
});

/**
 * Find Tweets with given media type
 *
 * request body contains:
 * 1: type: String : [photo, video]
 * 2: size – How many records per page (Optional for Pagination)
 * 3: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/withMediaType', function( req, res, next){

    var type = req.body.type;
    var sortOrder = null;

    if(type!=null){
        if(type === 'photo'){
            query =   {contains_photo : true};
        }
        else if(type === 'video'){
            query = {contains_video : true};
        }else {
            res.statusCode = 200;
            res.send('Type not supported, try: photo, video');
            return;
        }
        execQuery(query,sortOrder,req,res,next);
    }else {
        res.statusCode = 200;
        res.send('No type supplied!');
    }

});

/**
 * Find Tweets with given soure
 *
 * request body contains:
 * 1: source: String [Android,iPhone,iPad,Mac, TweetDeck, Web]
 * 2: size – How many records per page (Optional for Pagination)
 * 3: pageNo – the number of the page (Optional for Pagination)
 *
 * @return tweets_found / error message
 * */
router.post('/fromSource', function( req, res, next){

    var source = req.body.source;
    var sortOrder  = null;
    if(source!=null){
        if(source === 'Android'){
            query =   {fromAndroid : true};
        }
        else if(source === 'iPhone'){
            query = {fromiPhone : true};
        }
        else if(source === 'iPad'){
            query = {fromiPad : true};
        }else if(source === 'Mac'){
            query = {fromMac : true};
        }else if(source === 'Web'){
            query = {fromWebClient : true};
        }else if(source === 'TweetDeck'){
            query = {fromTweetDeck : true};
        }
        else {
            res.statusCode = 200;
            res.send('source not supported, try: Android, iPhone, iPad, Web, Mac, TweetDeck');
            return;
        }
        execQuery(query,sortOrder,req,res,next);
    }else {
        res.statusCode = 200;
        res.send('No source supplied!');
    }

});

/**
 * Find Tweets from a given Place
 *
 * Note: you can choose any combination of these 4 options
 *
 * request body contains:
 * 1: country: String,
 * 2: country_code: String,
 * 3: place_name: String,
 * 4: place_type: String
 * 5: size – How many records per page
 * 6: pageNo – the number of the page
 *
 * @return tweets_found / error message
 * */
router.post('/fromPlace', function( req, res, next){

    var place = req.body;

    var sortOrder = null;

    if(place!=null)
        execQuery(place,sortOrder,req,res,next);
    else {
        res.statusCode = 200;
        res.send('No place supplied!');
    }

});

/**
 * Execute query on Tweet Model
 *
 * @param query: query to be executed
 * @param sortorder: for sorting purpose
 * @param req: request Object (for Pagination)
 * @param res: response Object (for sending Results)
 * @param next: next callback
 * @return tweets_found / error message
 * */
function execQuery(query,sortorder,req, res, next) {
    const pageNo = parseInt(req.body.pageNo);
    const size = parseInt(req.body.size);


    // Pagination
    var options = {skip: 0, limit : 100};
    if(!isNaN(pageNo) && !isNaN(size)) {

        if(pageNo < 0 || pageNo === 0) {
            response = {"error" : true,"message" : "invalid page number, should start with 1"};
            return res.json(response)
        }

        options.skip = size * (pageNo - 1);
        options.limit = size;
    }
    if(sortorder !=null)
        options.sort = sortorder;

    Tweet.paginate(query,options).then(function (data) {
        // console.log(data);
        res.statusCode = 200;
        res.send(data);
    }, err => next(err))
        .catch(function(err) {
            console.log(err);
            res.statusCode = 500;
            res.send('Could not find Tweets');
        });

}

/**
 * Create a regex search pattern from the given text according to spefied rule
 * Rule: exact_match, starts_with, ends_with
 *
 * @param req: request Object
 * @param text
 *
 * @return regesPattern : String
 * */
function findPattern(req, text) {
    if (req.body.exact_match != null && req.body.exact_match)
        text = "^" + text + "$";
    else {
        if (req.body.starts_with != null && req.body.starts_with)
            text = "^" + text;
        if (req.body.ends_with != null && req.body.ends_with)
            text = text + '$'
    }
}

module.exports = router;
