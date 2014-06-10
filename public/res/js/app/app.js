
sys.app = {
	el: {},
	type: false,
	init: function() {
		// collection for fast access
		var els = jr('*[data-el]');
		for (var i=0, il=els.length; i<il; i++) {
			this.el[ els[i].getAttribute('data-el') ] = els[i];
		}

		// initate app
		for (var n in this) {
			if (typeof(this[n].init) === 'function') this[n].init(this);
		}

		sys.observer.trigger('app_init');

		//this.load('res/xml/font.xml');
		this.load('res/xml/hb.xml');
		//this.load('res/xml/hello.xml');
		// temp
		setTimeout(function() {
			//sys.app.unload();
		}, 500);

		//sys.popup.open('fopen');
		sys.confirm({
			'text': 'Are you sure that you want to delete this track?',
			'buttons': {
				'Cancel': function() {
					console.log('cancel');
				},
				'OK': function() {
					console.log('ok');
				}
			}
		});
	},
	save: function() {

	},
	unload: function() {
		sys.observer.trigger('file_unloaded');
	},
	load: function(path) {
		var _sys = sys,
			self = _sys.app,
			file = _sys.fs.load({path: path}).dom,
			xFile = file.selectSingleNode('//file');

		self.file = _sys.ledger.documentElement.appendChild(xFile);
		self.type = xFile.getAttribute('type');

		if (self.type === 'font') {

		} else {
			_sys.observer.trigger('file_loaded');
			//self.image.load();
		}
	},
	fileMeta: function(name) {
		var _sys = sys,
			self = _sys.app,
			node = self.file.selectSingleNode('//file//*[@name="'+ name +'"]');
		return node ? node.getAttribute('value') : false;
	},
	switchMode: function(type) {
		var _sys = sys;

		this.type = type;

		_sys.observer.trigger('mode_change');
	}
};
