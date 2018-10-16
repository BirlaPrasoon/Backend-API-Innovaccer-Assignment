# Backend using Twitter API's 
Using Twitter Search/Streaming API to fetch are store the target tweets with metadata
(eg: user details, tweet time, favorites and retweet counts etc ) for a recent high traffic event.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node JS, MongoDB, npm must be pre-installed in the environment, at the time of developement of this project, dependencies are:

 * [NPM](https://www.npmjs.com/package/download) v:6.4.1,
 * [Node JS](https://nodejs.org/en/download/) v:8.10.0
 * [Express JS](https://expressjs.com/) : Framework 
 * [MongoDB](https://www.mongodb.com/download-center/v2/cloud?initial=true) v3.6.8
 * Middlewares : [mongoose](https://www.npmjs.com/package/mongoose), [morgan](https://www.npmjs.com/package/morgan), [pug](https://www.npmjs.com/package/pug), [chalk](https://www.npmjs.com/package/chalk)
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
## API-1: http://localhost:3000/twitter
API for streaming and searching tweets on twitter providing 'keyword' to look upon. Stores curated version of tweet to the database.

#### 1: /search 
Post method to search tweets as requested for requested keyword.

##### Request Parameters: 
 * 1: query: keyword -> keyword upon which search to perform
 * 2: count: Number -> number of tweets to store
 * 3: wipe_previous -> Boolean: wipe out previous data
##### Example :
```
POST /twitter/search HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{ "query": "an", "count": 100, "wipe_previous": true }
```

#### 1: /stream 
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
