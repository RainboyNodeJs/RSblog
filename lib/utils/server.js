var connect = require('connect');
var pathFn = require('path');
var join = pathFn.join;

exports.run = function (options) {
    var port = options.port || 4000;
	
	
	var base = process.cwd();
    var root = join(base,'public')

    if (port < 3000) {
        log.error('Port number must greater than 3000');
        return;
    }

    connect.createServer(
        connect.static(root)
    ).listen(port);

    console.log('Server started at http://localhost:' + port + '/');
}