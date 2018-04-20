const utils = require ("daveutils");
const feedRead = require ("davefeedread");

const urlTestFeed = "http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml";
const timeOutSecs = 30;
const whenstart = new Date ();

feedRead.parseUrl (urlTestFeed, timeOutSecs, function (err, theFeed) {
	if (err) {
		console.log (err.message);
		}
	else {
		console.log ("It took " + utils.secondsSince (whenstart) + " seconds to read and parse the feed.");
		console.log ("theFeed.head == " + utils.jsonStringify (theFeed.head));
		console.log ("theFeed.items [0] == " + utils.jsonStringify (theFeed.items [0]));
		for (var i = 0; i < theFeed.items.length; i++) {
			console.log ("Item #" + utils.padWithZeros (i, 2) + ": " + theFeed.items [i].title + ".");
			}
		}
	});
