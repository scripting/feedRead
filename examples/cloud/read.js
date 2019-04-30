const utils = require ("daveutils");
const feedRead = require ("davefeedread");

const urlTestFeed = "http://scripting.com/rss.xml"; //has to be a feed that supports rssCloud
const timeOutSecs = 30;
const whenstart = new Date ();

const options = {
	port: 1415,
	feedUpdatedCallback: function (feedUrl) {
		console.log ("options.feedUpdatedCallback: feedUrl == " + feedUrl);
		}
	};
feedRead.startCloud (options, function () {
	feedRead.parseUrl (urlTestFeed, timeOutSecs, function (err, theFeed) {
		if (err) {
			console.log (err.message);
			}
		else {
			console.log ("It took " + utils.secondsSince (whenstart) + " seconds to read and parse the feed.");
			}
		});
	});
