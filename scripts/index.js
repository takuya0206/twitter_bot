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

const userstream = T.stream('user')

// Follow Back
userstream.on('follow', function(data) {
  const param = { user_id: data.source.id_str }
  // Avoid event made on my own
  if (data.source.id_str === config.ownerID) return;
  T.post('friendships/create', param, function(err, data, resp){});
});