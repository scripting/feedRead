const utils = require ("daveutils");
const feedRead = require ("davefeedread");

const urlTestFeed = "http://scripting.com/rss.xml";
const whenstart = new Date ();

feedRead.parseUrl (urlTestFeed, undefined, function (err, theFeed) {
	if (!err) {
		console.log ("It took " + utils.secondsSince (whenstart) + " seconds to read and parse the feed.");
		console.log ("theFeed.head == " + utils.jsonStringify (theFeed.head));
		console.log ("theFeed.items [0] == " + utils.jsonStringify (theFeed.items [0]));
		for (var i = 0; i < theFeed.items.length; i++) {
			console.log ("Item #" + utils.padWithZeros (i, 2) + ": " + theFeed.items [i].title + ".");
			}
		}
	});
