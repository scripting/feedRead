const fs = require ("fs");
const utils = require ("daveutils");
const feedRead = require ("davefeedread");

const urlTestFeed = "http://www.kenrockwell.com/rss.php";
const timeOutSecs = 30;
const whenstart = new Date ();

feedRead.parseUrl (urlTestFeed, timeOutSecs, function (err, theFeed) {
	if (err) {
		console.log (err.message);
		}
	else {
		console.log ("It took " + utils.secondsSince (whenstart) + " seconds to read and parse the feed.");
		
		var item = theFeed.items [0];
		var rssguid = item ["rss:guid"];
		console.log ("rssguid == " + utils.jsonStringify (rssguid));
		
		console.log ("theFeed.head == " + utils.jsonStringify (theFeed.head));
		console.log ("theFeed.items [0] == " + utils.jsonStringify (theFeed.items [0]));
		theFeed.items.forEach (function (item, i) {
			console.log ("Item #" + utils.padWithZeros (i, 2) + ": " + item.title + ".");
			});
		fs.writeFile ("feed.xml", utils.jsonStringify (theFeed), function (err) {
			});
		}
	});
