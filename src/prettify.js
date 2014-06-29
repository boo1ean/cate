var pd = require('pretty-data').pd;
var fs = require('fs');
var request = require('request');
var jsb = require('js-beautify');

var formats = ['xml', 'json', 'sql', 'css'];

// TODO content analyze
var guessFormat = function(filepath, content) {
	var format = filepath.split('.').pop();
	return format;
};

// TODO handle errors properly
var getContent = function(filepath, cb) {
	if (isURL(filepath)){
		request(filepath, function(err, res, content){
				if (err) return cb('Can\'t open URL');
				cb(content.toString());
		});
	} else {
		fs.exists(filepath, function(exists) {
			if (!exists) {
				return cb('Can\'t open file.');
			}

			fs.readFile(filepath, function(err, content) {
				cb(content.toString());
			});
		});
	}
};

var nop = function(a) {
	return a;
};

var getFormatter = function(format) {
	if (formats.indexOf(format) !== -1) {
		return pd[format].bind(pd);	
	} else if (format === 'js'){
		return jsb;
	} else {
		return nop;
	}

};

// TODO many input files
var prettify = function(filepath, cb) {
	getContent(filepath, function(content) {
		var formatter = getFormatter(guessFormat(filepath, content));
		cb(formatter(content));
	});
};

var isURL = function(filepath){
	return filepath.search(/\w*:\/\//) !== -1;
}

module.exports = prettify;
