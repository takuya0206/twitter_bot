'use strict';
const config = require('./config');
const Twit = require('twit');
const request = require('request');
const fs = require('fs');


let log = new Map();
const fileName = './scripts/log.json';
try {
	const update = fs.readFileSync(fileName, 'utf8');
	log = new Map(JSON.parse(update));
} catch (ignore) {
	console.log('There is no prior conversation.');
};

const T = new Twit({
	consumer_key:         config.key,
	consumer_secret:      config.secret,
	access_token:         config.token,
	access_token_secret:  config.token_secret,
	timeout_ms:           60*1000
});

const userStream = T.stream('user');
const keywordStream = T.stream('statuses/filter', { track: ['learn Japanese', 'learning Japanese', 'Japanese lessons', 'Japanese grammar', 'study Japanese', config.userName]});

// Follow Back
userStream.on('follow', function(data) {
	const param = { user_id: data.source.id_str };
	if (data.source.id_str === config.ownerID) return;
	T.post('friendships/create', param, function(err, data, resp){});
});

// Follow Based on Keywords
keywordStream.on('tweet', function(data){
	const param = { user_id: data.user.id_str };
	T.post('friendships/create', param, function(err, data, resp){});
});

// Reply with conversation API
function save() {fs.writeFileSync(fileName, JSON.stringify(Array.from(log)), 'utf8');}
const record = {};

keywordStream.on('tweet', function(data){
	const textToString = data.text.toString();
	const target = data.user.screen_name.toString();
	if (textToString.includes(config.userName) && data.source.id_str !== config.ownerID) {
		record.utt = textToString;
		record.nickname = target;
		if (log.has(target)){record.context = log.get(target)};
		const param = { body: JSON.stringify(record)};
		request.post(config.url + config.API_key, param, function(err, res, data) {
			const body = JSON.parse(data);
			T.post('statuses/update', {status: '@' + target + ' ' + body.utt});
			log.set(target, body.context);
			save();
		});
	};
});
