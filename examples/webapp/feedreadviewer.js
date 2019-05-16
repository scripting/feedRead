var myProductName = "feedReadViewer", myVersion = "0.4.1";

const fs = require ("fs");
const request = require ("request");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const feedRead = require ("davefeedread");

const urlTemplate = "http://scripting.com/code/feedreadviewer/template.html";
const timeOutSecs = 30;

const config = {
	port: 1415,
	flLogToConsole: true
	}

function httpReadUrl (url, callback) {
	var options = { 
		url: url,
		jar: true,
		gzip: true, //6/25/17 by DW
		maxRedirects: 5,
		headers: {
			"User-Agent": myProductName + " v" + myVersion
			}
		};
	request (options, function (err, response, data) {
		if (!err && (response.statusCode == 200)) {
			callback (undefined, data.toString ());
			}
		else {
			if (!err) {
				err = {
					message: "Can't read the file because there was an error. Code == " + response.statusCode + "."
					}
				}
			callback (err);
			}
		});
	}
davehttp.start (config, function (theRequest) {
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	function returnHtml (htmltext) {
		theRequest.httpReturn (200, "text/html", htmltext.toString ());
		}
	function returnData (jstruct) {
		if (jstruct === undefined) {
			jstruct = {};
			}
		theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
		}
	function httpReturn (err, htmltext) {
		if (err) {
			returnError (err);
			}
		else {
			returnHtml (htmltext);
			}
		}
	switch (theRequest.lowerpath) {
		case "/":
			var feedUrl = theRequest.params.url;
			feedRead.parseUrl (theRequest.params.url, timeOutSecs, function (err, theFeed) {
				httpReadUrl (urlTemplate, function (err, templateText) {
					if (err) {
						httpReturn (err);
						}
					else {
						var pagetable = {
							url: feedUrl,
							bodytext: utils.jsonStringify (theFeed)
							};
						var htmltext = utils.multipleReplaceAll (templateText.toString (), pagetable, false, "[%", "%]");
						httpReturn (err, htmltext);
						}
					});
				});
			break;
		default: 
			theRequest.httpReturn (404, "text/plain", "Not found.");
			break;
		}
	});
