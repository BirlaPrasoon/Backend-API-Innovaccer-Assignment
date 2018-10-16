# API-1: /twitter
API for streaming and searching tweets on twitter providing 'keyword' to look upon. Stores curated version of tweet to the database.

### 1: /search 
Post method to search tweets as requested for requested keyword.

##### Request Parameters: 
 * 1: query: keyword -> keyword upon which search to perform
 * 2: count: Number -> number of tweets to store
 * 3: wipe_previous -> Boolean: wipe out previous data

#### Returns : 
  Number of tweets stored in the database.
##### Example :
```
POST /twitter/search HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "query": "an", "count": 100, "wipe_previous": true }
```

### 2: /stream 
Post method to stream tweets for a given time interval for requested keyword.

##### Request Parameters: 
 * 1: query: keyword
 * 2: time_to_stream: number (seconds)
 * 3: wipe previous data: Boolean
 
##### Example :
```
POST /twitter/search HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "query": "an", "count": 100, "wipe_previous": true }
```
#### Returns : 
  Number of tweets stored in the databas.
