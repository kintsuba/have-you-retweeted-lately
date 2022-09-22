# Have you Retweeted lately?

## What is this?

Have you ever thought to yourself, "This follower only likes and never retweets"?  
I have, many, many times.

This tool fetches a week's worth of tweets from your followers and outputs the names of users whose tweets did not include any retweets.

## Requirements

**Node.js >= 17.0.0**

## Usage

After you clone it, create a .env file in the root directory and edit it using the following example.

```dosini
TWITTER_BEARER_TOKEN=*********** # Please create an App on the Twitter Developer Portal
USER_NAME=example #Your account username (e.g. @example)
```

After the above work is done, it will be executable by `yarn dev`, etc.

## Licence
CC0-1.0
