const properties = {
    dbURL: 'mongodb://localhost:27017/twitterratti',
    twitter_client:{
        consumer_key:         'nZdGwSZmZmWPEN4EnAn2gybTY',
        consumer_secret:      'KPAKjVo80Y7QbPRESE8B6InbdLAB4eMwLeeqkIo5GIFKAhSGre',
        access_token:         '2657005188-Z8y3A07lIBEDSpwq7ZgpqVvPIAMbvhXz6TuO5J4',
        access_token_secret:  'gslj5rJQk6oTknXp8xpkydwBreq7H23Fwp4OFr2SlIo3M',
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL:            true,     // optional - requires SSL certificates to be valid.
    },
};

module.exports = properties;