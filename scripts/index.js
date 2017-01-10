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

const userStream = T.stream('user');
const keywordStream = T.stream('statuses/filter', { track: ['learn Japanese', 'learning Japanese', 'Japanese lessons', 'Japanese grammar', 'study Japanese'] });

// Follow Back
userStream.on('follow', function(data) {
	const param = { user_id: data.source.id_str };
  // Avoid event made on my own
  if (data.source.id_str === config.ownerID) return;
  T.post('friendships/create', param, function(err, data, resp){});
});

// Follow Based on Keywords
keywordStream.on('tweet', function(data){
	const param = { user_id: data.user.id_str };
	T.post('friendships/create', param, function(err, data, resp){});
});
		
		
