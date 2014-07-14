var log4js = require('log4js');
if (process.env.SERVER_SOFTWARE === 'bae/3.0') {
	log4js.loadAppender('baev3-log');
	var options = {
		'user': 'TD1e3G5P4Mo4fXfcv61NiBNB',
		'passwd': 'gOAj8tDc1WqE8yj7EyXPfvbrThvMxLkj'
	}
	log4js.addAppender(log4js.appenders['baev3-log'](options));
} else {
	log4js.configure({
	  appenders: [
		{ type: 'console' }, //¿ØÖÆÌ¨Êä³ö
	  ]
	});
}
var logger = log4js.getLogger('node-log-sdk');
logger.setLevel('INFO');
logger.trace('baev3-log trace log');
logger.debug('baev3-log Debug log');
logger.info('baev3-log Info log');
logger.warn('baev3-log Warn log');
logger.error('baev3-log Error log');
logger.fatal('baev3-log Fatal log');

exports.Logger = logger;