'use strict';
const config = require('./config');
const Twit = require('twit');


const T = new Twit({
	consumer_key:         config.key,
	consumer_secret:      config.secret,
	access_token:         config.token,
	access_token_secret:  config.token_secret,
	timeout_ms:           60*1000
});

