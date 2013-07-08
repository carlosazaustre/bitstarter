#!/usr/bin/env node
/* 
 Automatically grade files for the presence of specified HTML tags/attributes.
 Uses commander.js and cheerio. Teaches command line application development
 and basic DOM parsing.

 References:

 + cheerio
 	- https://github.com/MatthewMueller/cheerio
  - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
  - http://maxogden.com/scraping-with-node.html

 + commander.js
  - https://github.com/visionmedia/commander.js
  - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON 
  - http://en.wikipedia.org/wiki/JSON
  - https://developer.mozilla.org/en-US/docs/JSON
  - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs 			= require('fs')
,		program = require('commander')
,		cheerio = require('cheerio')
,		rest 		= require('restler')

,		HTMLFILE_DEFAULT 		= "index.html"
,		CHECKSFILE_DEFAULT 	= "checks.json"
,		FILE_TEMP_DEFAULT 	= "temp.html";

var assertFileExists = function(infile) {
	var instr = infile.toString(9);
	if(!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
	}
	return instr;
};

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;
};

var checkURLFile = function(urlfile, checksfile) {
	var _fileFromURL = FILE_TEMP_DEFAULT;

	rest.get(urlfile).on('complete', function(result) {
		
		if(result instanceof Error) {
			console.log('Error: ' + result.message);
			this.retry(5000);
		
		} else {
			fs.writeFileSync(_fileFromURL, result);
			grader(_fileFromURL, checksfile);
		}

	});
};

var grader = function(htmlfile, checksfile) {
	var checkJson = checkHtmlFile(htmlfile, checksfile);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
}

if(require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
		.option('-u, --url <url_to_file>', 'Path to URL')
		.parse(process.argv);

	if(program.url){	
		checkURLFile(program.url, program.checks);
	
	} else {
		grader(program.file, program.checks);
	} 	

} else {
	exports.checkHtmlFile = checkHtmlFile;
	exports.checkURL = checkURLFile;
}













