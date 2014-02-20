
sys.fs = {
	init: function() {
		this.fs = require('fs');
		this.path = require('path');

		this.xml = this.load({path: 'res/xml/ledger.xml'}).dom;
		this.xsl = this.load({path: 'res/xsl/common.xsl'}).dom;
	},
	dispose: function() {
		
	},
	handleError: function(err) {
		
	},
	parseXml: function(str) {
		var parser = new DOMParser();
		return parser.parseFromString(str, 'text/xml');
	},
	load: function(file, callback) {
		var fsApi = this,
			autoParse = ['.xml', '.xsl'];
		
		file.extension = file.path.slice(-4);

		if (callback) {
			fsApi.fs.readFile(file.path, 'utf8', function(err, data) {
				if (err) return fs.handleError( err );
				file.text = data;
				if (autoParse.indexOf(file.extension) > -1) {
					file.dom = fsApi.parseXml(file.text);
				}
				callback(file);
			});
		} else {
			file.text = fsApi.fs.readFileSync(file.path, 'utf8');
			if (autoParse.indexOf(file.extension) > -1) {
				file.dom = fsApi.parseXml(file.text);
			}
			return file;
		}
	},
	save: function(file, callback) {
		var fsApi = this;
		fsApi.fs.writeFile(file.path, file.text, 'utf8', function(err) {
			if (err) return fsApi.handleError( err );
			callback(file);
		});
	}
};
