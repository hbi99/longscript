
sys.app = {
	el: {},
	mode: false,
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

		this.load('res/xml/hb.xml');
	},
	load: function(path) {
		var _sys = sys,
			file = _sys.fs.load({path: path}).dom,
			xFile = file.selectSingleNode('//file');

		_sys.app.file = _sys.fs.xml.documentElement.appendChild(xFile);

		_sys.observer.trigger('file_loaded');
	},
	switchMode: function(mode) {
		var _sys = sys;

		this.mode = mode;

		_sys.observer.trigger('mode_change');
	}
};
