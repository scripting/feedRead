### What is this?

It's a <a href="https://www.npmjs.com/package/davefeedread">Node package</a> that contains everything you need to read a feed. 

It builds on the <a href="https://github.com/danmactough/node-feedparser">feedParser package</a>. It's simpler to call, no need to master <a href="https://nodejs.org/api/stream.html#stream_stream">streams</a> or <a href="https://www.npmjs.com/package/iconv">iconv</a>. 

You can also parse a string, so you can deal with files that contain feed data, not just feeds accessible over the web. Or the feed text could come from a database. 

Because we use feedParser, we handle all the formats and variability that it handles. 

It's an entry-level feed parser that will be useful to people who haven't mastered all of JavaScript. 

### Why?

Sometimes you need to quickly read a feed and do something with it, and don't have time for a major project. This package is for those times. 

It also provides good sample code for more advanced feed reading projects. 

### Example code

There are two very basic examples, one that parses a feed that it reads <a href="https://github.com/scripting/feedRead/blob/master/examples/readurl/read.js">over the web</a>, and one that it reads from a <a href="https://github.com/scripting/feedRead/blob/master/examples/readfile/read.js">local file</a>.

A third example is a realistic <a href="https://github.com/scripting/feedRead/blob/master/examples/cloud/read.js">feed polling app</a>, it checks a feed every five minutes and writes the JSON structure out to a local disk. It automatically supports <a href="https://en.blog.wordpress.com/2009/09/07/rss-in-the-clouds/">rssCloud</a>, so you get realtime updates if the feed supports that protocol, which is part of RSS 2.0. 

