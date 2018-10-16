# API 2: /getTweets
API for getting the tweets stored. Apply filters, sorting and get tweets

### Optional Pagination: 
  ### Request Paramenters required
 * 1: size (default 100) – How many records per page (Optional for Pagination)
 * 2: pageNo (default 0)– the number of the page (Optional for Pagination)

#### 1: /all 
Post request for getting all the Tweets stored in the database.

##### Example :
```
POST /gettweets/all HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "query": "an", "count": 100, "wipe_previous": true }
```

#### 2: /sorted
Post request for getting all the Tweets stored in the database based on supplied sort rule.

##### Request Parameters: 
 ###### value 1 represents : Descending order
 ###### value -1 represents: Ascending order

 * 1: created_at: [-1,1]
 * 2: user_name: [-1,1]
 * 3: user_screen_name: [-1,1]
 * 4: text: [-1,1]
 * 5: retweet_count: [-1,1]
 * 6: favorite_count: [-1,1]
 * 7: hashtag_count: [-1,1]
 * 8: urls_count: [-1,1]
 * 9: user_mentions_count: [-1,1]

##### Example :
```
POST /gettweets/sorted HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "user_name": 1, "screen_name": 1, "retweet_count": 1}
```

### 3: /withTweetId/:tweet_id
GET method to find a tweet in the database with given tweet id.
 
##### Example :
```
GET /gettweets/withTweetId/1052021778489516000 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

```
### 4: /withText
Post method to find tweets in the database with given text.

##### Request Parameters: 
 * 1: text: String
 
##### Example :
```
POST /gettweets/withText HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "text" : "I just made an offer on poshmark for a black sequin jacket to wear to IDKH and MAX next month..I’m really hoping they accept" }
```
### 5: /withNumberOfHashtags
Post method to find tweets in the database with number of Hashtags greater than equal to , less than equal to , or exactly given.

##### Request Parameters: 
 * 1: gte: Number -> greater than equal to
 * 2: lte: Number -> less than equal to
 * 3: exact: Number -> Exactly (If supplied, will be considered)
 
##### Example :
```
POST /gettweets/withNumberOfHashtags HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "gte": 1 }
```
### 6: /withNumberOfUrls  
Post method to find tweets in the database with number of Urls greater than equal to , less than equal to , or exactly given. Similar to 4.
 
### 7: /withNumberOfUserMentions  
Post method to find tweets in the database with number of UserMentions greater than equal to , less than equal to , or exactly given. Similar to 4.

### 8: /withRetweetCount  
Post method to find tweets in the database with number of Retweet Count greater than equal to , less than equal to , or exactly given. Similar to 4.

### 9: /withHashtag
Post method to find tweets in the database with given Hashtag in text.

##### Request Parameters: 
 * 1: hashtag: String
 
##### Example :
```
POST /gettweets/withHashtag HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "hashtag":"video" }
```

### 10: /withUrl
Post method to find tweets in the database with given Url in text. Similar to 9.


### 11: /withUserMention
 Post method to find tweets in the database with given UserMention in text. Similar to 9.

### 12: /fromUserWithUsername
 Post method to find tweets in the database with given User's name in text.

##### Request Parameters: 
 * 1: user_name: String
 
 ##### Example :
```
POST /gettweets/withUsername HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "user_name":"Prasoon Birla" }
```
### 13: /fromUserWithScreenName
 Post method to find tweets in the database with given User's screen_name in text. Similar to 12.

### 14: /withinDateRange
 Post method to find tweets in the database within a date range.

##### Request Parameters: 
 *  Note: date_first should have occurred before date_second
 *
 * 1: date_first: ISO format (if only this supplied: gte this will result)
 * 2: data_second: ISO format(if only this supplied: lte this will result)
 
  ##### Example :
 ```
POST /gettweets/withinDateRange HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "date_first" : "2018-10-16T02:21:52.000Z", "date_second" : "2018-10-16T02:21:52.000Z" }
``` 

### 15: /onDate
 Post method to find tweets in the database on a specific date and time.

##### Request Parameters: 
 * 1: date: ISO format
 
  ##### Example :
 ```
POST /gettweets/onDate HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "date" : "2018-10-16T02:21:52.000Z" }
``` 

### 16: /withMediaType
 Post method to find tweets in the database containing a video or photo.

##### Request Parameters: 
 * 1: type: String : [photo, video]
 
  ##### Example :
 ```
POST /gettweets/withMediaType HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "type": "photo" }
``` 

### 17: /fromSource
 Post method to find tweets in the database from a specified source.

##### Request Parameters: 
 * 1: source: String [Android,iPhone,iPad,Mac, TweetDeck, Web]
 
  ##### Example :
 ```
POST /gettweets/fromSource HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "source": "Android" }
``` 
### 18: /fromPlace
 Post method to find tweets in the database from a specified place.

##### Request Parameters: 
 * 1: country: String,
 * 2: country_code: String,
 * 3: place_name: String,
 * 4: place_type: String
 
  ##### Example :
 ```
POST /gettweets/fromPlace HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "country_code": "IN" }
``` 

