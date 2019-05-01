const utils = require ("daveutils");
const feedRead = require ("davefeedread");
const fs = require ("fs");

const urlTestFeed = "http://scripting.com/rss.xml"; //has to be a feed that supports rssCloud
const timeOutSecs = 30;
const fnameFeedJson = "theFeed.json";
var whenLastCheck;

function checkFeed (feedUrl, callback) {
	whenLastCheck = new Date ();
	feedRead.parseUrl (feedUrl, timeOutSecs, function (err, theFeed) {
		if (err) {
			console.log ("checkFeed: err.message == " + err.message);
			}
		else {
			var nowstring = new Date ().toLocaleTimeString ();
			console.log (nowstring + ": The title of the feed is \"" + theFeed.head.title + ",\" there are " + theFeed.items.length + " items in the feed.");
			fs.writeFile (fnameFeedJson, utils.jsonStringify (theFeed), function (err) { //write out the object so you have something to study
				});
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function everySecond () {
	if (utils.secondsSince (whenLastCheck) > 5 * 60) { //five minutes between polls
		checkFeed (urlTestFeed);
		}
	}

const options = {
	port: 1415,
	feedUpdatedCallback: checkFeed
	};
feedRead.startCloud (options, function () {
	checkFeed (urlTestFeed);
	setInterval (everySecond, 1000); 
	});
