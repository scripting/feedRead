const fs = require ("fs");
const utils = require ("daveutils");
const feedRead = require ("../../feedread.js");

const urlTestFeed = "https://rss.firesky.tv?filter=from%3Aacarvin.bsky.social"; //5/18/23 by DW
const timeOutSecs = 30;
const whenstart = new Date ();

feedRead.parseUrl (urlTestFeed, timeOutSecs, function (err, theFeed) {
	if (err) {
		console.log (err.message);
		}
	else {
		console.log ("It took " + utils.secondsSince (whenstart) + " seconds to read and parse the feed.");
		
		console.log ("theFeed.head == " + utils.jsonStringify (theFeed.head));
		if (theFeed.items.length > 0) {
			var item = theFeed.items [0];
			var rssguid = item ["rss:guid"];
			console.log ("rssguid == " + utils.jsonStringify (rssguid));
			console.log ("theFeed.items [0] == " + utils.jsonStringify (theFeed.items [0]));
			theFeed.items.forEach (function (item, i) {
				console.log ("Item #" + utils.padWithZeros (i, 2) + ": " + item.title + ".");
				});
			}
		
		fs.writeFile ("feed.xml", utils.jsonStringify (theFeed), function (err) {
			});
		}
	});
