
sys.fs = {
	init: function() {
		this.fs = require('fs');
		this.path = require('path');
	},
	dispose: function() {
		
	},
	handleError: function(err) {
		
	},
	load: function(file, callback) {
		var fs = this;
		this.fs.readFile(file.path, 'utf8', function(err, data) {
			if (err) fs.handleError( err );
			callback(file);
		});
	},
	save: function(file, callback) {
		var fs = this;
		this.fs.writeFile(file.path, file.text, 'utf8', function(err) {
			if (err) fs.handleError( err );
			callback(file);
		});
	}
};
