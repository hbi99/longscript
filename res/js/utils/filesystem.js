
sys.fs = {
	init: function() {
		this.fs = require('fs');
		this.path = require('path');

		console.log(1);

		this.load({path: 'res/xml/ledger.xml'}, function() {
			console.log( arguments );
		});
	},
	dispose: function() {
		
	},
	handleError: function(err) {
		
	},
	load: function(file, callback) {
		var fs = this;
		this.fs.readFile(file.path, 'utf8', function(err, data) {
			if (err) return fs.handleError( err );
			file.text = data;
			callback(file);
		});
	},
	save: function(file, callback) {
		var fs = this;
		this.fs.writeFile(file.path, file.text, 'utf8', function(err) {
			if (err) return fs.handleError( err );
			callback(file);
		});
	}
};
