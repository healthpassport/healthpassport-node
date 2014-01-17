var redis = require('redis');
var store;

if (process.env.REDISTOGO_URL) {
	var rtg = require("url").parse(process.env.REDISTOGO_URL);
	store = redis.createClient(rtg.port, rtg.hostname);
	store.auth(rtg.auth.split(":")[1]);
} else {
	store = redis.createClient();
}
module.exports = exports = store;