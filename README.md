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

A thiird example demonstrates a feature added in May 2019, that makes it easy to support <a href="https://github.com/scripting/feedRead/blob/master/examples/readfile/read.js">realtime updates</a> via rssCloud. 

