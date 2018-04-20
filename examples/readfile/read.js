const utils = require ("daveutils");
const feedRead = require ("davefeedread");
const fs = require ("fs");

fs.readFile ("rss.xml", function (err, filetext) {
	if (err) {
		console.log (err.message);
		}
	else {
		feedRead.parseString (filetext, undefined, function (err, theFeed) {
			console.log (utils.jsonStringify (theFeed.head));
			});
		}
	});
