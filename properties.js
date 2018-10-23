const properties = {
    dbURL: 'mongodb://localhost:27017/twitterratti',
    twitter_client:{
        consumer_key:         '---------',
        consumer_secret:      '-------------------------',
        access_token:         '--------------------------------------',
        access_token_secret:  '-----------------------------------------------',
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL:            true,     // optional - requires SSL certificates to be valid.
    },
};

module.exports = properties;
