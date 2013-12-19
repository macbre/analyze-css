var format = require('util').format,
	MAX_LENGTH = 256;

function rule(analyzer) {
	analyzer.setMetric('comments');
	analyzer.setMetric('commentsLength');

	analyzer.on('comment', function(comment) {
		analyzer.incrMetric('comments');
		analyzer.incrMetric('commentsLength', comment.length);

		// report too long comments
		if (comment.length > MAX_LENGTH) {
			analyzer.addOffender('comments', format('"%s" is too long (%d characters)', comment.substr(0, 100), comment.length));
		}
	});
}

rule.description = 'Reports too long CSS comments';
module.exports = rule;
