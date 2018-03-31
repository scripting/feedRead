const utils = require ("daveutils");
const feedRead = require ("davefeedread");

const urlTestFeed = "https://www.presseportal.de/rss/dienststelle_110972.rss2";
const whenstart = new Date ();

feedRead.parseUrl (urlTestFeed, undefined, function (err, theFeed) {
	if (!err) {
		console.log ("It took " + utils.secondsSince (whenstart) + " seconds to read and parse the feed.");
		console.log ("theFeed.head == " + utils.jsonStringify (theFeed.head));
		for (var i = 0; i < theFeed.items.length; i++) {
			console.log ("Item #" + utils.padWithZeros (i, 2) + ": " + theFeed.items [i].title + ".");
			}
		}
	});
