var myProductName = "davefeedread"; myVersion = "0.5.14";   

/*  The MIT License (MIT)
	Copyright (c) 2014-2019 Dave Winer
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

exports.parseString = parseFeedString;
exports.parseUrl = parseFeedUrl;
exports.getCharset = getCharset;
exports.startCloud = startCloud; //4/30/19 by DW

const utils = require ("daveutils");
const feedParser = require ("feedparser");
const request = require ("request");
const stream = require ("stream");
const iconv = require ("iconv-lite");
const qs = require ("querystring");
const davehttp = require ("davehttp"); 

const metaNames = { 
	title: true,
	link: true,
	description: true,
	pubDate: true,
	language: true,
	copyright: true,
	generator: true,
	cloud: true,
	image: true,
	categories: true
	};

//rssCloud support -- 4/30/19 by DW
	var cloudConfig = { 
		flPingEnabled: false, //if true, we set up a server to receive pings from the cloud server
		port: 1414, //the port the ping receiver runs on
		path: "/feedping", //the message we ask the ping server to send us
		timeOutSecs: 30,
		feedUpdatedCallback: function (feedUrl, callback) {
			if (callback !== undefined) {
				callback ();
				}
			}
		};
	var cloudFeeds = new Object (); 
	
	function pleaseNotify (feedUrl, theCloud, callback) {
		var urlCloudServer = "http://" + theCloud.domain + ":" + theCloud.port + theCloud.path;
		var now = new Date ();
		var theRequest = {
			url: urlCloudServer,
			followRedirect: true, 
			headers: {Accept: "application/json"},
			method: "POST",
			form: {
				port: cloudConfig.port,
				path: cloudConfig.path,
				url1: feedUrl,
				protocol: "http-post"
				}
			};
		request (theRequest, function (err, response, body) {
			if (err) {
				console.log ("pleaseNotify: err.message == " + err.message);
				}
			else {
				console.log ("pleaseNotify: response == " + utils.jsonStringify (response));
				}
			});
		}
	function checkForCloud (feedUrl, theFeed) { //4/30/19 by DW
		if (cloudConfig.flPingEnabled) {
			if (theFeed.head.cloud !== undefined) {
				if (cloudFeeds [feedUrl] === undefined) { //haven't registered with cloud server for this feed
					pleaseNotify (feedUrl, theFeed.head.cloud);
					cloudFeeds [feedUrl] = new Date ();
					}
				}
			}
		}
	function startCloud (options, callback) { //4/30/19 by DW
		function everyHour () {
			cloudFeeds = new Object (); //re-request notification every hour
			}
		function startServer (callback) {
			var httpconfig = {
				port: cloudConfig.port,
				flPostEnabled: true,
				flLogToConsole: true
				};
			davehttp.start (httpconfig, function (theRequest) {
				if (theRequest.lowerpath == cloudConfig.path) {
					var jstruct = qs.parse (theRequest.postBody);
					cloudConfig.feedUpdatedCallback (jstruct.url, function (err, data) {
						if (err) {
							theRequest.httpReturn (500, "text/plain", err.message);
							}
						else {
							if (data) {
								theRequest.httpReturn (200, "application/json", utils.jsonStringify (data));
								}
							else {
								theRequest.httpReturn (200, "text/plain", "Thanks for the update! ;-)");
								}
							}
						});
					}
				else {
					theRequest.httpReturn (404, "text/plain", "Not found.");
					}
				});
			if (callback !== undefined) {
				callback ();
				}
			}
		
		if (options !== undefined) {
			for (var x in options) {
				cloudConfig [x] = options [x];
				}
			}
		cloudConfig.flPingEnabled = true;
		
		console.log ("startCloud: options == " + utils.jsonStringify (options));
		
		startServer (callback);
		setInterval (everyHour, 60 * 60 * 1000); 
		}

function getCharset (httpResponse) {
	var contentType = httpResponse.headers ["content-type"];
	if (contentType !== undefined) {
		var encoding = utils.trimWhitespace (utils.stringNthField (contentType, ";", 2));
		if (encoding.length > 0) {
			var charset = utils.trimWhitespace (utils.stringNthField (encoding, "=", 2));
			return (charset);
			}
		}
	return (undefined); //no charset specified
	}
function checkForNoneLengthEnclosures (theFeed) { //5/14/19 by DW
	//feedparser under some circumstances will return a length for an enclosure of "None". 
		//this is not what my apps were expecting and as a result we missed a bunch of podcasts due to errors.
		//zero is much easier to handle, and there really is no correct value if the length is omitted, since it is required by RSS 2.0.
		//but what can you do -- this is the real world, and this happens. examples -- Radio Lab, Here's the Thing.
	if (theFeed !== undefined) { //11/27/19 by DW -- this happens in feedbase
		theFeed.items.forEach (function (item) {
			if (item.enclosures !== undefined) {
				item.enclosures.forEach (function (enc) {
					if (enc.length == "None") {
						enc.length = 0;
						}
					});
				}
			});
		}
	}
function parseFeedString (theString, charset, callback, errMsgPrefix) {
	var feedparser = new feedParser ();
	var theFeed = {
		head: new Object (),
		items: new Array ()
		};
	var flCalledBack = false; //1/29/19 by DW
	function consoleMessage (s) {
		}
	if (charset !== undefined) {
		try {
			theString = iconv.decode (theString, charset); //4/18/18 by DW -- use iconv-lite
			}
		catch (err) {
			consoleMessage ("err.message == " + err.message);
			if (callback !== undefined) { //1/26/19 by DW
				flCalledBack = true;
				callback (err);
				}
			}
		}
	
	var theStream = new stream.Readable;
	theStream.push (theString);
	theStream.push (null);
	
	feedparser.on ("readable", function () {
		try {
			var item = this.read ();
			if (item !== null) {
				theFeed.items.push (item);
				for (var x in item.meta) {
					if (metaNames [x] !== undefined) {
						theFeed.head [x] = item.meta [x];
						}
					}
				}
			}
		catch (err) {
			console.log ("parseFeedString: err.message == " + err.message);
			}
		});
	feedparser.on ("error", function (err) {
		consoleMessage ("err.message == " + err.message);
		if (!flCalledBack) { //make sure the callback is only called once -- 1/29/19 by DW
			flCalledBack = true;
			if (callback !== undefined) {
				callback (err, theFeed);
				}
			}
		});
	feedparser.on ("end", function () {
		if (!flCalledBack) {
			flCalledBack = true;
			if (callback !== undefined) {
				callback (undefined, theFeed);
				}
			}
		});
	
	theStream.pipe (feedparser);
	}
function parseFeedUrl (feedUrl, timeOutSecs, callback) {
	var theRequest = {
		url: feedUrl, 
		encoding: null,
		jar: true,
		gzip: true,
		maxRedirects: 5,
		headers: {
			"User-Agent": myProductName + " v" + myVersion
			}
		};
	if (timeOutSecs !== undefined) {
		theRequest.timeout = timeOutSecs * 1000;
		}
	request (theRequest, function (err, response, theString) {
		if (err) {
			if (callback !== undefined) {
				var theErrorResponse = {
					statusCode: 400 //something like ENOTFOUND or ETIMEDOUT
					};
				callback (err, undefined, theErrorResponse);
				}
			}
		else {
			if (response.statusCode != 200) {
				if (callback !== undefined) {
					var theErrorResponse = {
						message: "Error reading the feed, response.statusCode == " + response.statusCode + ".",
						statusCode: response.statusCode
						};
					callback (theErrorResponse, undefined, response);
					}
				}
			else {
				parseFeedString (theString, getCharset (response), function (err, theFeed) {
					checkForCloud (feedUrl, theFeed); //4/30/19 by DW
					checkForNoneLengthEnclosures (theFeed); //5/14/19 by DW
					if (callback !== undefined) {
						callback (err, theFeed, response); //4/17/18 by DW -- pass err back to caller
						}
					}, myProductName + ": feedUrl == " + feedUrl);
				}
			}
		});
	}
